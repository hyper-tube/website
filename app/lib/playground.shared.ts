export const PLAYGROUND_FEATURES = [
  'colors',
  'transitions',
  'lyrics',
  'offline',
  'equalizer',
] as const;

export type PlaygroundFeature = (typeof PLAYGROUND_FEATURES)[number];

export interface BeatGrid {
  readonly bpm: number;
  readonly downbeat: number;
  readonly confident: boolean;
}

export interface TrackAnalysis {
  readonly start: number;
  readonly end: number;
  readonly fadeOut: number | null;
  readonly intro: BeatGrid;
  readonly outro: BeatGrid;
  readonly head: string;
  readonly tail: string;
}

export interface LyricLine {
  readonly time: number;
  readonly text: string;
}

export interface DemoTrack {
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly src: string;
  readonly duration: number;
  readonly cover: number;
  readonly downloaded: boolean;
  readonly analysis: TrackAnalysis;
  readonly lyrics?: readonly LyricLine[];
  readonly lyricist?: string;
}

export { DEFAULT_SEED } from './seed.shared';

export const DEMO_SEEDS = [
  '#7c83ff',
  '#6750a4',
  '#3f7be0',
  '#00a0a0',
  '#2e9e62',
  '#b58900',
  '#e0673f',
  '#d5407a',
] as const;

export const EQ_BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const;

export const EQ_RANGE = 12;

export const EQ_PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bass: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
  vocal: [-3, -2, 0, 2, 4, 4, 3, 1, 0, -1],
  treble: [0, 0, 0, 0, 0, 1, 2, 4, 5, 6],
} as const satisfies Record<string, readonly number[]>;

export type EqPreset = keyof typeof EQ_PRESETS;

export function lyricIndexAt(lines: readonly LyricLine[], position: number): number {
  let index = 0;

  lines.forEach((line, lineIndex) => {
    if (line.time <= position) index = lineIndex;
  });

  return index;
}

export function formatTime(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));

  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export function nextPlayableIndex(
  tracks: readonly DemoTrack[],
  from: number,
  direction: 1 | -1,
  playable: (track: DemoTrack) => boolean,
): number | null {
  for (let offset = 1; offset < tracks.length; offset++) {
    const candidate = (from + direction * offset + tracks.length) % tracks.length;
    if (playable(tracks[candidate])) return candidate;
  }

  return null;
}
