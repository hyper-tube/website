import { EQ_BANDS } from './playground.shared';

const LOWEST = EQ_BANDS[0];
const HIGHEST = EQ_BANDS[EQ_BANDS.length - 1];
const BAND_INSET = 0.05;

export function spectrumLevels(bins: Uint8Array, sampleRate: number, points: number): number[] {
  const nyquist = sampleRate / 2;
  const octaves = Math.log2(HIGHEST / LOWEST);

  const frequencyAt = (fraction: number) =>
    LOWEST * 2 ** (((fraction - BAND_INSET) / (1 - BAND_INSET * 2)) * octaves);

  return Array.from({ length: points }, (_, index) => {
    const low = frequencyAt((index - 0.5) / (points - 1));
    const high = frequencyAt((index + 0.5) / (points - 1));
    const first = Math.floor((low / nyquist) * bins.length);
    const last = Math.max(first + 1, Math.ceil((high / nyquist) * bins.length));

    let sum = 0;
    for (let bin = first; bin < last && bin < bins.length; bin++) sum += bins[bin];

    return sum / (last - first) / 255;
  });
}
