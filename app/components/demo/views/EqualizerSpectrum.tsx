import { useAnimationFrame } from 'motion/react';
import { useRef } from 'react';

import { useDemoPlayer } from '~/providers/demo-player';
import { spectrumLevels } from '~/lib/spectrum';

const BINS = 1024;
const POINTS = 72;

export function EqualizerSpectrum() {
  const { playing, readSpectrum } = useDemoPlayer();

  const canvas = useRef<HTMLCanvasElement>(null);
  const bins = useRef(new Uint8Array(BINS));
  const cleared = useRef(true);

  useAnimationFrame(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;

    const sampleRate = playing ? readSpectrum(bins.current) : null;

    if (sampleRate === null) {
      if (!cleared.current) context.clearRect(0, 0, element.width, element.height);
      cleared.current = true;
      return;
    }

    const ratio = window.devicePixelRatio;
    const width = Math.round(element.clientWidth * ratio);
    const height = Math.round(element.clientHeight * ratio);

    if (element.width !== width || element.height !== height) {
      element.width = width;
      element.height = height;
    }

    const levels = spectrumLevels(bins.current, sampleRate, POINTS);

    context.clearRect(0, 0, width, height);
    context.fillStyle = getComputedStyle(element).color;
    context.beginPath();
    context.moveTo(0, height);
    levels.forEach((level, index) =>
      context.lineTo((index / (POINTS - 1)) * width, height - level * height),
    );
    context.lineTo(width, height);
    context.closePath();
    context.fill();

    cleared.current = false;
  });

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full text-primary/15"
    />
  );
}
