import { extendTailwindMerge } from 'tailwind-merge';
import { createTV } from 'tailwind-variants';
import { clsx, type ClassValue } from 'clsx';

const twMergeConfig = {
  extend: {
    theme: {
      text: [
        'hero',
        'display-large',
        'display-medium',
        'display-small',
        'headline-large',
        'headline-medium',
        'headline-small',
        'title-large',
        'title-medium',
        'title-small',
        'body-large',
        'body-medium',
        'body-small',
        'label-large',
        'label-medium',
        'label-small',
      ],
      radius: ['unsharpen', 'verysmall', 'small', 'normal', 'large', 'verylarge', 'huge'],
      shadow: ['level1', 'level2', 'level3', 'level4'],
      ease: [
        'expressive-fast',
        'expressive',
        'expressive-slow',
        'effects',
        'emphasized',
        'emphasized-decel',
        'emphasized-accel',
        'standard',
      ],
    },
  },
};

const twMerge = extendTailwindMerge(twMergeConfig);

export const tv = createTV({ twMergeConfig });

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
