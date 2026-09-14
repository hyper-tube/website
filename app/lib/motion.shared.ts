import { cubicBezier, type Transition } from 'motion';

type Bezier = [number, number, number, number];

export const CURVES = {
  expressiveFast: [0.42, 1.67, 0.21, 0.9],
  expressive: [0.38, 1.21, 0.22, 1],
  expressiveSlow: [0.39, 1.29, 0.35, 0.98],
  effects: [0.34, 0.8, 0.34, 1],
  emphasizedAccel: [0.3, 0, 0.8, 0.15],
  emphasizedDecel: [0.05, 0.7, 0.1, 1],
  standard: [0.2, 0, 0, 1],
} as const satisfies Record<string, Bezier>;

export const DURATIONS = {
  fast: 0.2,
  spatialFast: 0.35,
  spatial: 0.5,
  spatialSlow: 0.65,
  enter: 0.4,
  exit: 0.2,
} as const;

const EMPHASIZED_SPLIT = 1 / 6;
const EMPHASIZED_KNEE = 0.4;

const emphasizedHead = cubicBezier(...CURVES.emphasizedAccel);
const emphasizedTail = cubicBezier(...CURVES.emphasizedDecel);

export function emphasized(progress: number): number {
  if (progress <= EMPHASIZED_SPLIT) {
    return emphasizedHead(progress / EMPHASIZED_SPLIT) * EMPHASIZED_KNEE;
  }

  const tail = (progress - EMPHASIZED_SPLIT) / (1 - EMPHASIZED_SPLIT);

  return EMPHASIZED_KNEE + emphasizedTail(tail) * (1 - EMPHASIZED_KNEE);
}

export const TRANSITIONS = {
  effects: { duration: DURATIONS.fast, ease: CURVES.effects },
  fastSpatial: { duration: DURATIONS.spatialFast, ease: CURVES.expressiveFast },
  spatial: { duration: DURATIONS.spatial, ease: CURVES.expressive },
  slowSpatial: { duration: DURATIONS.spatialSlow, ease: CURVES.expressiveSlow },
  emphasized: { duration: DURATIONS.spatial, ease: emphasized },
  enter: { duration: DURATIONS.enter, ease: CURVES.emphasizedDecel },
  exit: { duration: DURATIONS.exit, ease: CURVES.emphasizedAccel },
} as const satisfies Record<string, Transition>;

export const REDUCED_TRANSITION = { duration: 0.12, ease: 'linear' } as const satisfies Transition;
