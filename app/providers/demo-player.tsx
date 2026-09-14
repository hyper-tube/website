import { useAnimationFrame, useMotionValue, type MotionValue } from 'motion/react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  planTransition,
  transitionWindow,
  type TransitionMode,
  type TransitionPair,
} from '~/lib/transitions.shared';
import { nextPlayableIndex, type DemoTrack } from '~/lib/playground.shared';
import { useDemoEqualizer, type DemoEqualizer } from '~/hooks/useDemoEqualizer';
import type { DemoAudioEngine } from '~/lib/demo-audio';
import { DEMO_TRACKS } from '~/lib/demo-songs.shared';
import { useDemoAudio } from '~/hooks/useDemoAudio';

interface DemoPlayerValue {
  track: DemoTrack;
  playing: boolean;
  position: MotionValue<number>;
  timeline: MotionValue<number>;
  pair: TransitionPair | null;
  transitioning: boolean;
  mode: TransitionMode;
  equalizer: DemoEqualizer;
  liked: ReadonlySet<string>;
  downloaded: ReadonlySet<string>;
  offline: boolean;
  isPlayable: (track: DemoTrack) => boolean;
  toggle: () => void;
  play: (trackId: string) => void;
  step: (direction: 1 | -1) => void;
  seek: (seconds: number) => void;
  previewTransition: () => void;
  setMode: (mode: TransitionMode) => void;
  readSpectrum: (target: Uint8Array<ArrayBuffer>) => number | null;
  toggleLike: (trackId: string) => void;
  markDownloaded: (trackId: string) => void;
  setOffline: (offline: boolean) => void;
}

const DemoPlayerContext = createContext<DemoPlayerValue | null>(null);

const RESTART_THRESHOLD = 3;

const initiallyDownloaded = () =>
  new Set(DEMO_TRACKS.filter((track) => track.downloaded).map((track) => track.id));

const indexOf = (track: DemoTrack) => DEMO_TRACKS.findIndex(({ id }) => id === track.id);

function timelineTime(
  engine: DemoAudioEngine,
  running: TransitionPair | null,
  upcoming: TransitionPair | null,
): number {
  const time = engine.timelineTime;

  if (running && time !== null) return time;
  if (upcoming && engine.track?.id === upcoming.from.id) return engine.time;

  return Number.NaN;
}

interface DemoPlayerProviderProps {
  active: boolean;
}

export function DemoPlayerProvider({
  active,
  children,
}: PropsWithChildren<DemoPlayerProviderProps>) {
  const position = useMotionValue(0);
  const timeline = useMotionValue(Number.NaN);
  const equalizer = useDemoEqualizer();

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<TransitionMode>('smart');
  const [running, setRunning] = useState<TransitionPair | null>(null);
  const [liked, setLiked] = useState<ReadonlySet<string>>(() => new Set(['friend-to-friend']));
  const [downloaded, setDownloaded] = useState<ReadonlySet<string>>(initiallyDownloaded);
  const [offline, setOfflineState] = useState(false);

  const track = DEMO_TRACKS[index];
  const isPlayable = (candidate: DemoTrack) => !offline || downloaded.has(candidate.id);
  const upcomingIndex = nextPlayableIndex(DEMO_TRACKS, index, 1, isPlayable);

  const upcoming = useMemo<TransitionPair | null>(() => {
    if (upcomingIndex === null) return null;

    const to = DEMO_TRACKS[upcomingIndex];

    return { from: track, to, plan: planTransition(mode, track, to) };
  }, [mode, track, upcomingIndex]);

  const audio = useDemoAudio({
    onTransitionStart: setRunning,
    onHandoff: (next) => setIndex(indexOf(next)),
    onTransitionEnd: () => setRunning(null),
    onEnded: () => setPlaying(false),
    onBlocked: () => setPlaying(false),
  });

  useEffect(() => {
    audio.engine.current?.setUpcoming(upcoming);
  }, [audio.engine, ready, upcoming]);

  useEffect(() => {
    audio.engine.current?.setEqualizer(equalizer.gains, equalizer.enabled);
  }, [audio.engine, ready, equalizer.gains, equalizer.enabled]);

  useAnimationFrame(() => {
    const engine = audio.engine.current;
    if (!engine || !active) return;

    position.set(engine.time);
    timeline.set(timelineTime(engine, running, upcoming));
  });

  const engineFor = (target: DemoTrack, time: number) => {
    if (audio.engine.current) return audio.engine.current;

    const engine = audio.create();

    engine.load(target, time);
    setReady(true);

    return engine;
  };

  const load = (nextIndex: number, time = 0) => {
    position.set(time);
    setIndex(nextIndex);

    const engine = audio.engine.current;
    if (!engine) return;

    engine.load(DEMO_TRACKS[nextIndex], time);
    if (playing) engine.play();
  };

  const seek = (seconds: number) => {
    const time = Math.min(Math.max(seconds, 0), track.duration);

    position.set(time);
    audio.engine.current?.seek(time);
  };

  const value: DemoPlayerValue = {
    track,
    playing,
    position,
    timeline,
    pair: running ?? upcoming,
    transitioning: running !== null,
    mode,
    equalizer,
    liked,
    downloaded,
    offline,
    isPlayable,
    seek,
    setMode,
    toggle: () => {
      if (playing) {
        audio.engine.current?.pause();
        setPlaying(false);
        return;
      }

      engineFor(track, position.get()).play();
      setPlaying(true);
    },
    play: (trackId) => {
      const next = DEMO_TRACKS.findIndex((candidate) => candidate.id === trackId);
      if (next !== index) load(next);

      engineFor(DEMO_TRACKS[next], next === index ? position.get() : 0).play();
      setPlaying(true);
    },
    step: (direction) => {
      if (direction === -1 && position.get() > RESTART_THRESHOLD) {
        seek(0);
        return;
      }

      const next = nextPlayableIndex(DEMO_TRACKS, index, direction, isPlayable);
      if (next !== null) load(next);
    },
    previewTransition: () => {
      if (!upcoming || running) return;

      const start = Math.max(0, transitionWindow(upcoming.plan).start);
      const engine = engineFor(track, start);

      seek(start);
      engine.play();
      setPlaying(true);
    },
    readSpectrum: (target) => audio.engine.current?.readSpectrum(target) ?? null,
    toggleLike: (trackId) =>
      setLiked((current) => {
        const next = new Set(current);
        if (!next.delete(trackId)) next.add(trackId);

        return next;
      }),
    markDownloaded: (trackId) => setDownloaded((current) => new Set(current).add(trackId)),
    setOffline: (next) => {
      setOfflineState(next);
      if (!next || downloaded.has(track.id)) return;

      const fallback = DEMO_TRACKS.findIndex((candidate) => downloaded.has(candidate.id));
      if (fallback !== -1) load(fallback);
    },
  };

  return <DemoPlayerContext.Provider value={value}>{children}</DemoPlayerContext.Provider>;
}

export function useDemoPlayer(): DemoPlayerValue {
  const context = useContext(DemoPlayerContext);

  if (!context) {
    throw new Error('useDemoPlayer must be used inside DemoPlayerProvider');
  }

  return context;
}
