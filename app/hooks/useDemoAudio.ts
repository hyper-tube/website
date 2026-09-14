import { useEffect, useRef, type RefObject } from 'react';

import { DemoAudioEngine, type DemoAudioEvents } from '~/lib/demo-audio';

interface DemoAudio {
  engine: RefObject<DemoAudioEngine | null>;
  create: () => DemoAudioEngine;
}

export function useDemoAudio(events: DemoAudioEvents): DemoAudio {
  const engine = useRef<DemoAudioEngine | null>(null);
  const handlers = useRef(events);

  useEffect(() => {
    handlers.current = events;
  });

  useEffect(
    () => () => {
      engine.current?.dispose();
      engine.current = null;
    },
    [],
  );

  const create = () => {
    engine.current ??= new DemoAudioEngine({
      onTransitionStart: (pair) => handlers.current.onTransitionStart(pair),
      onHandoff: (track) => handlers.current.onHandoff(track),
      onTransitionEnd: () => handlers.current.onTransitionEnd(),
      onEnded: () => handlers.current.onEnded(),
      onBlocked: () => handlers.current.onBlocked(),
    });

    return engine.current;
  };

  return { engine, create };
}
