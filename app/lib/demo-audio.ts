import {
  gainCurve,
  transitionWindow,
  type TransitionPair,
  type TransitionPlan,
} from './transitions.shared';
import { EQ_BANDS, type DemoTrack } from './playground.shared';

export interface DemoAudioEvents {
  onTransitionStart: (pair: TransitionPair) => void;
  onHandoff: (track: DemoTrack) => void;
  onTransitionEnd: () => void;
  onEnded: () => void;
  onBlocked: () => void;
}

interface TransitionClock {
  readonly pair: TransitionPair;
  readonly startedAt: number;
  readonly until: number;
}

interface ActiveTransition {
  readonly pair: TransitionPair;
  readonly outgoing: number;
  readonly incoming: number;
  readonly startedAt: number;
  readonly entry: number | undefined;
  handedOff: boolean;
  lockedAt: number;
}

const TICK_INTERVAL = 40;
const PRECISE_START = 0.08;
const PRELOAD_LEAD = 12;
const SCHEDULE_DELAY = 0.01;
const SMOOTHING = 0.015;

const BASS_FREQUENCY = 180;
const BASS_CUT = -24;
const BASS_RAMP = 0.4;
const BAND_Q = Math.SQRT2;

const LOCK_WINDOW = 1.5;
const LOCK_INTERVAL = 0.3;
const LOCK_TOLERANCE = 0.015;
const RATE_RECOVERY = 0.005;

const SPECTRUM_SIZE = 2048;

class Deck {
  readonly audio = new Audio();
  readonly fade: GainNode;
  readonly bass: BiquadFilterNode;
  track: DemoTrack | null = null;

  constructor(context: AudioContext, output: AudioNode) {
    this.audio.preload = 'auto';

    this.fade = context.createGain();
    this.bass = context.createBiquadFilter();
    this.bass.type = 'lowshelf';
    this.bass.frequency.value = BASS_FREQUENCY;

    context
      .createMediaElementSource(this.audio)
      .connect(this.bass)
      .connect(this.fade)
      .connect(output);
  }

  load(track: DemoTrack): void {
    if (this.track?.id === track.id) return;

    this.track = track;
    this.audio.src = track.src;
  }

  reset(time: number): void {
    for (const param of [this.fade.gain, this.bass.gain]) {
      param.cancelScheduledValues(0);
      param.setTargetAtTime(param === this.fade.gain ? 1 : 0, time, SMOOTHING);
    }
  }

  stop(time: number): void {
    this.audio.pause();
    this.audio.playbackRate = 1;
    this.reset(time);
  }
}

export class DemoAudioEngine {
  private readonly context = new AudioContext();
  private readonly headroom = this.context.createGain();
  private readonly analyser = this.context.createAnalyser();
  private readonly bands: BiquadFilterNode[];
  private readonly decks: readonly [Deck, Deck];
  private readonly events: DemoAudioEvents;
  private readonly timer: number;

  private current = 0;
  private upcoming: TransitionPair | null = null;
  private transition: ActiveTransition | null = null;
  private clock: TransitionClock | null = null;
  private pendingStart: number | null = null;

  constructor(events: DemoAudioEvents) {
    this.events = events;
    this.analyser.fftSize = SPECTRUM_SIZE;

    this.bands = EQ_BANDS.map((frequency) => {
      const band = this.context.createBiquadFilter();

      band.type = 'peaking';
      band.frequency.value = frequency;
      band.Q.value = BAND_Q;

      return band;
    });

    [...this.bands, this.analyser].reduce<AudioNode>(
      (previous, node) => previous.connect(node),
      this.headroom,
    );
    this.analyser.connect(this.context.destination);

    this.decks = [new Deck(this.context, this.headroom), new Deck(this.context, this.headroom)];
    this.decks.forEach((deck) => deck.audio.addEventListener('ended', () => this.ended(deck)));

    this.timer = window.setInterval(() => this.tick(), TICK_INTERVAL);
  }

  get track(): DemoTrack | null {
    return this.deck.track;
  }

  get time(): number {
    return this.deck.audio.currentTime;
  }

  get timelineTime(): number | null {
    const { clock } = this;
    if (!clock) return null;

    return clock.pair.plan.outStart + this.context.currentTime - clock.startedAt;
  }

  private get deck(): Deck {
    return this.decks[this.current];
  }

  private get idle(): Deck {
    return this.decks[1 - this.current];
  }

  load(track: DemoTrack, time = 0): void {
    this.finishTransition();
    this.deck.load(track);
    this.deck.audio.currentTime = time;
  }

  play(): void {
    void this.context.resume();
    this.deck.audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'NotAllowedError')
        this.events.onBlocked();
    });
  }

  pause(): void {
    this.finishTransition();
    this.deck.audio.pause();
  }

  seek(time: number): void {
    this.finishTransition();
    this.deck.audio.currentTime = time;
  }

  setUpcoming(upcoming: TransitionPair | null): void {
    this.upcoming = upcoming;
    this.cancelPendingStart();
  }

  setEqualizer(gains: readonly number[], enabled: boolean): void {
    const now = this.context.currentTime;
    const applied = gains.map((gain) => (enabled ? gain : 0));

    this.bands.forEach((band, index) => band.gain.setTargetAtTime(applied[index], now, SMOOTHING));
    this.headroom.gain.setTargetAtTime(10 ** (-Math.max(0, ...applied) / 20), now, SMOOTHING);
  }

  readSpectrum(target: Uint8Array<ArrayBuffer>): number {
    this.analyser.getByteFrequencyData(target);

    return this.context.sampleRate;
  }

  dispose(): void {
    window.clearInterval(this.timer);
    this.cancelPendingStart();

    for (const deck of this.decks) {
      deck.audio.pause();
      deck.audio.removeAttribute('src');
      deck.audio.load();
    }

    this.clock = null;

    void this.context.close();
  }

  private tick(): void {
    if (this.clock && this.context.currentTime >= this.clock.until) this.stopClock();

    if (this.transition) {
      this.stepTransition(this.transition);
      return;
    }

    const { deck, upcoming } = this;
    this.recoverRate(deck);

    if (!upcoming || upcoming.from.id !== deck.track?.id) return;
    if (deck.audio.paused || this.pendingStart !== null) return;

    const remaining = upcoming.plan.outStart - deck.audio.currentTime;
    if (remaining <= PRELOAD_LEAD) this.idle.load(upcoming.to);
    if (remaining > PRECISE_START) return;

    const delay = Math.max(0, remaining / deck.audio.playbackRate) * 1000;

    this.pendingStart = window.setTimeout(() => {
      this.pendingStart = null;
      this.startTransition(upcoming);
    }, delay);
  }

  private startTransition(pair: TransitionPair): void {
    const { plan, to } = pair;
    const now = this.context.currentTime;
    const outgoing = this.deck;
    const incoming = this.idle;

    incoming.load(to);
    incoming.audio.currentTime = plan.inStart;
    incoming.audio.playbackRate = plan.rate;

    if (plan.length > 0) this.scheduleFades(plan, outgoing, incoming, now + SCHEDULE_DELAY);

    const enter = () => void incoming.audio.play().catch(() => undefined);
    const entry = plan.inDelay > 0 ? window.setTimeout(enter, plan.inDelay * 1000) : undefined;

    if (entry === undefined) enter();

    this.transition = {
      pair,
      outgoing: this.current,
      incoming: 1 - this.current,
      startedAt: now,
      entry,
      handedOff: false,
      lockedAt: 0,
    };

    this.clock = {
      pair,
      startedAt: now,
      until: now + transitionWindow(plan).end - plan.outStart,
    };

    this.events.onTransitionStart(pair);
    this.stepTransition(this.transition);
  }

  private scheduleFades(plan: TransitionPlan, outgoing: Deck, incoming: Deck, at: number): void {
    for (const [deck, side] of [
      [outgoing, 'out'],
      [incoming, 'in'],
    ] as const) {
      deck.fade.gain.cancelScheduledValues(0);
      deck.fade.gain.setValueCurveAtTime(gainCurve(plan, side), at, plan.length);
      deck.bass.gain.cancelScheduledValues(0);
    }

    if (plan.bassSwap === null) return;

    const swapStart = at + plan.bassSwap - BASS_RAMP / 2;

    outgoing.bass.gain.setValueAtTime(0, swapStart);
    outgoing.bass.gain.linearRampToValueAtTime(BASS_CUT, swapStart + BASS_RAMP);
    incoming.bass.gain.setValueAtTime(BASS_CUT, at);
    incoming.bass.gain.setValueAtTime(BASS_CUT, swapStart);
    incoming.bass.gain.linearRampToValueAtTime(0, swapStart + BASS_RAMP);
  }

  private stepTransition(transition: ActiveTransition): void {
    const { plan, to } = transition.pair;
    const outgoing = this.decks[transition.outgoing];
    const incoming = this.decks[transition.incoming];
    const elapsed = this.context.currentTime - transition.startedAt;

    if (plan.kind === 'beatmix') this.lockPhase(transition, incoming, elapsed - plan.inDelay);

    if (!transition.handedOff && elapsed >= plan.handoff) {
      transition.handedOff = true;
      this.current = transition.incoming;
      this.events.onHandoff(to);
    }

    if (elapsed >= plan.length) this.endTransition(transition, outgoing);
  }

  private lockPhase(transition: ActiveTransition, incoming: Deck, playing: number): void {
    const { plan } = transition.pair;
    const { audio } = incoming;

    if (audio.paused || audio.seeking || playing > LOCK_WINDOW) return;
    if (playing - transition.lockedAt < LOCK_INTERVAL) return;

    const error = audio.currentTime - (plan.inStart + playing * plan.rate);

    transition.lockedAt = playing;
    if (Math.abs(error) > LOCK_TOLERANCE) audio.currentTime -= error;
  }

  private endTransition(transition: ActiveTransition, outgoing: Deck): void {
    outgoing.stop(this.context.currentTime);
    this.transition = null;

    if (!transition.handedOff) {
      this.current = transition.incoming;
      this.events.onHandoff(transition.pair.to);
    }
  }

  private finishTransition(): void {
    this.cancelPendingStart();
    this.stopClock();

    const { transition } = this;
    if (!transition) return;

    const now = this.context.currentTime;
    const outgoing = this.decks[transition.outgoing];
    const incoming = this.decks[transition.incoming];

    window.clearTimeout(transition.entry);

    if (transition.handedOff) {
      outgoing.stop(now);
      incoming.reset(now);
      incoming.audio.playbackRate = 1;
    } else {
      incoming.stop(now);
      outgoing.reset(now);
    }

    this.transition = null;
  }

  private stopClock(): void {
    if (!this.clock) return;

    this.clock = null;
    this.events.onTransitionEnd();
  }

  private cancelPendingStart(): void {
    if (this.pendingStart === null) return;

    window.clearTimeout(this.pendingStart);
    this.pendingStart = null;
  }

  private recoverRate(deck: Deck): void {
    const { playbackRate } = deck.audio;
    if (playbackRate === 1) return;

    const step = (RATE_RECOVERY * TICK_INTERVAL) / 1000;

    deck.audio.playbackRate =
      Math.abs(playbackRate - 1) <= step ? 1 : playbackRate + Math.sign(1 - playbackRate) * step;
  }

  private ended(deck: Deck): void {
    if (deck !== this.deck || this.transition) return;

    this.stopClock();

    this.events.onEnded();
  }
}
