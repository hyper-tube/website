const MINIMUM_DURATION = 1400;

export function downloadWithProgress(
  url: string,
  onProgress: (fraction: number) => void,
  minimum = MINIMUM_DURATION,
): Promise<void> {
  const startedAt = performance.now();

  let received = 0;
  let failed = false;

  const transfer = fetch(url).then(async (response) => {
    if (!response.ok || !response.body) throw new Error(`Could not download ${url}`);

    const total = Number(response.headers.get('content-length'));
    const reader = response.body.getReader();
    let loaded = 0;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      loaded += value.byteLength;
      if (total > 0) received = Math.min(loaded / total, 0.99);
    }

    received = 1;
  });

  transfer.catch(() => {
    failed = true;
  });

  const display = new Promise<void>((resolve) => {
    const frame = () => {
      const shown = Math.min(received, (performance.now() - startedAt) / minimum);
      onProgress(shown);

      if (shown >= 1 || failed) resolve();
      else requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  });

  return Promise.all([transfer, display]).then(() => undefined);
}
