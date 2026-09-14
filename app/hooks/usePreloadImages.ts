import { useEffect } from 'react';

export interface PreloadImage {
  readonly srcSet: string;
  readonly sizes: string;
}

export function usePreloadImages(images: readonly PreloadImage[], enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const handle = window.setTimeout(() => {
      images.forEach(({ srcSet, sizes }) => {
        const image = new Image();

        image.decoding = 'async';
        image.sizes = sizes;
        image.srcset = srcSet;
      });
    }, 1500);

    return () => window.clearTimeout(handle);
  }, [images, enabled]);
}
