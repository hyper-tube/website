export function settleWithin<T, F>(
  promise: Promise<T>,
  milliseconds: number,
  fallback: F,
): Promise<T | F> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const deadline = new Promise<F>((resolve) => {
    timeout = setTimeout(() => resolve(fallback), milliseconds);
  });

  return Promise.race([promise, deadline]).finally(() => clearTimeout(timeout));
}
