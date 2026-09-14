import type { DemoTrack, TrackAnalysis } from './playground.shared';

export const TRANSITION_MODES = ['off', 'crossfade', 'smart'] as const;

export type TransitionMode = (typeof TRANSITION_MODES)[number];

export type TransitionKind = 'gapless' | 'crossfade' | 'beatmix' | 'fade';

type Curve = 'cut' | 'equalPower' | 'beatmix' | 'ownFade';

export interface TransitionPlan {
  readonly kind: TransitionKind;
  readonly curve: Curve;
  readonly outStart: number;
  readonly inStart: number;
  readonly inDelay: number;
  readonly length: number;
  readonly rate: number;
  readonly handoff: number;
  readonly bassSwap: number | null;
  readonly bar: number | null;
  readonly downbeat: number | null;
}

export interface TransitionPair {
  readonly from: DemoTrack;
  readonly to: DemoTrack;
  readonly plan: TransitionPlan;
}

export interface TransitionWindow {
  readonly start: number;
  readonly end: number;
}

const CROSSFADE_SECONDS = 6;
const LOUD_EDGE_SECONDS = 4;
const OWN_FADE_LIMIT = 12;
const OWN_FADE_MINIMUM = 3;
const TEMPO_TOLERANCE = 0.04;
const PHRASE_BARS = [16, 8, 4];
const BEATMIX_LIMIT = 20;
const WINDOW_PADDING = 4;
const WINDOW_MINIMUM = 12;
const OUTRO_REGION = 75;

const ENVELOPE_RATE = 4;
const ENVELOPE_LEVELS = 35;
const ENVELOPE_FALLBACK = 0.7;

const quarter = (progress: number) => Math.min(1, Math.max(0, progress)) * (Math.PI / 2);

const GAINS: Record<Curve, Record<'out' | 'in', (progress: number) => number>> = {
  cut: {
    out: (progress) => (progress < 1 ? 1 : 0),
    in: (progress) => (progress < 1 ? 0 : 1),
  },
  equalPower: {
    out: (progress) => Math.cos(quarter(progress)),
    in: (progress) => Math.sin(quarter(progress)),
  },
  beatmix: {
    out: (progress) => (progress < 0.5 ? 1 : Math.cos(quarter((progress - 0.5) * 2))),
    in: (progress) => Math.sin(quarter(progress * 2)),
  },
  ownFade: {
    out: (progress) => (progress < 0.8 ? 1 : Math.cos(quarter((progress - 0.8) * 5))),
    in: (progress) => Math.sin(quarter(progress * 1.4)),
  },
};

const foldTempo = (ratio: number) => {
  let folded = ratio;

  while (folded > 1.5) folded /= 2;
  while (folded < 0.75) folded *= 2;

  return folded;
};

const nextOnGrid = (anchor: number, step: number, time: number) =>
  anchor + Math.ceil((time - anchor) / step - 1e-6) * step;

function gapless(from: TrackAnalysis, to: TrackAnalysis): TransitionPlan {
  return {
    kind: 'gapless',
    curve: 'cut',
    outStart: from.end,
    inStart: to.start,
    inDelay: 0,
    length: 0,
    rate: 1,
    handoff: 0,
    bassSwap: null,
    bar: null,
    downbeat: null,
  };
}

function crossfade(from: TrackAnalysis, to: TrackAnalysis): TransitionPlan {
  return {
    kind: 'crossfade',
    curve: 'equalPower',
    outStart: from.end - CROSSFADE_SECONDS,
    inStart: to.start,
    inDelay: 0,
    length: CROSSFADE_SECONDS,
    rate: 1,
    handoff: CROSSFADE_SECONDS / 2,
    bassSwap: null,
    bar: null,
    downbeat: null,
  };
}

function beatmix(from: TrackAnalysis, to: TrackAnalysis, duration: number): TransitionPlan | null {
  if (!from.outro.confident || !to.intro.confident) return null;

  const rate = foldTempo(from.outro.bpm / to.intro.bpm);
  if (Math.abs(rate - 1) > TEMPO_TOLERANCE) return null;

  const bar = 240 / from.outro.bpm;
  const musicalEnd = from.fadeOut ?? from.end;

  for (const bars of PHRASE_BARS) {
    const length = bars * bar;
    if (length > BEATMIX_LIMIT) continue;

    const outStart =
      from.outro.downbeat + Math.floor((musicalEnd - length - from.outro.downbeat) / bar) * bar;

    if (outStart < duration - OUTRO_REGION) continue;

    return {
      kind: 'beatmix',
      curve: 'beatmix',
      outStart,
      inStart: to.intro.downbeat,
      inDelay: 0,
      length,
      rate,
      handoff: length / 2,
      bassSwap: length / 2,
      bar,
      downbeat: from.outro.downbeat,
    };
  }

  return null;
}

function fade(from: TrackAnalysis, to: TrackAnalysis): TransitionPlan {
  const ownFade = from.fadeOut !== null && from.end - from.fadeOut >= OWN_FADE_MINIMUM;
  const length = ownFade
    ? Math.min(from.end - (from.fadeOut ?? 0), OWN_FADE_LIMIT)
    : LOUD_EDGE_SECONDS;
  const outStart = from.end - length;

  const onBeat = from.outro.confident && to.intro.confident;
  const lead = to.intro.downbeat - to.start;
  const beat = 60 / from.outro.bpm;

  const inDelay = onBeat
    ? nextOnGrid(from.outro.downbeat, beat, outStart + lead) - outStart - lead
    : 0;

  return {
    kind: 'fade',
    curve: ownFade ? 'ownFade' : 'equalPower',
    outStart,
    inStart: to.start,
    inDelay,
    length,
    rate: 1,
    handoff: length / 2,
    bassSwap: ownFade ? null : length / 2,
    bar: null,
    downbeat: null,
  };
}

export function planTransition(
  mode: TransitionMode,
  from: DemoTrack,
  to: DemoTrack,
): TransitionPlan {
  if (mode === 'off') return gapless(from.analysis, to.analysis);
  if (mode === 'crossfade') return crossfade(from.analysis, to.analysis);

  return beatmix(from.analysis, to.analysis, from.duration) ?? fade(from.analysis, to.analysis);
}

export function transitionGain(plan: TransitionPlan, side: 'out' | 'in', elapsed: number): number {
  if (plan.length === 0) return GAINS.cut[side](elapsed >= 0 ? 1 : 0);

  return GAINS[plan.curve][side](elapsed / plan.length);
}

export function gainCurve(plan: TransitionPlan, side: 'out' | 'in', count = 128): Float32Array {
  return Float32Array.from({ length: count }, (_, index) =>
    transitionGain(plan, side, (index / (count - 1)) * plan.length),
  );
}

export function transitionWindow(plan: TransitionPlan): TransitionWindow {
  const middle = plan.outStart + plan.length / 2;
  const half = Math.max(plan.length / 2 + WINDOW_PADDING, WINDOW_MINIMUM / 2);

  return { start: middle - half, end: middle + half };
}

export function levelAt(track: DemoTrack, time: number): number {
  const { head, tail } = track.analysis;
  if (time < 0 || time > track.duration) return 0;

  const tailStart = track.duration - tail.length / ENVELOPE_RATE;
  const [source, offset] = time >= tailStart ? [tail, tailStart] : [head, 0];

  const position = (time - offset) * ENVELOPE_RATE;
  const index = Math.floor(position);
  if (index >= source.length) return ENVELOPE_FALLBACK;

  const level = (at: number) => parseInt(source[Math.min(at, source.length - 1)], 36);
  const blend = position - index;

  return (level(index) * (1 - blend) + level(index + 1) * blend) / ENVELOPE_LEVELS;
}

export function transitionLevels(
  plan: TransitionPlan,
  from: DemoTrack,
  to: DemoTrack,
  samples: number,
): Record<'out' | 'in', number[]> {
  const window = transitionWindow(plan);
  const times = Array.from(
    { length: samples + 1 },
    (_, index) => window.start + (index / samples) * (window.end - window.start),
  );

  const outgoing = (time: number) => {
    const elapsed = time - plan.outStart;
    if (elapsed > plan.length) return 0;

    return levelAt(from, time) * (elapsed < 0 ? 1 : transitionGain(plan, 'out', elapsed));
  };

  const incoming = (time: number) => {
    const playing = time - plan.outStart - plan.inDelay;
    if (playing < 0) return 0;

    return (
      levelAt(to, plan.inStart + playing * plan.rate) *
      transitionGain(plan, 'in', time - plan.outStart)
    );
  };

  return { out: times.map(outgoing), in: times.map(incoming) };
}

export function barsInWindow(plan: TransitionPlan, limit: number): number[] {
  const { bar, downbeat } = plan;
  if (bar === null || downbeat === null) return [];

  const window = transitionWindow(plan);
  const first = nextOnGrid(downbeat, bar, window.start);

  return Array.from({ length: limit }, (_, index) => first + index * bar).filter(
    (time) => time <= window.end,
  );
}
