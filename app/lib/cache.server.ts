interface CacheEntry<T> {
  value?: { readonly data: T };
  expires: number;
  pending?: Promise<T>;
  failure?: { readonly error: unknown; readonly retryAt: number };
}

const FAILURE_BACKOFF_SECONDS = 60;

export class StaleCache<T> {
  readonly #entries = new Map<string, CacheEntry<T>>();

  constructor(
    private readonly ttlSeconds: number,
    private readonly onError: (key: string, error: unknown) => void,
  ) {}

  async get(key: string, load: () => Promise<T>): Promise<T> {
    const entry = this.#entries.get(key);

    if (!entry?.value) {
      if (entry?.failure && entry.failure.retryAt > Date.now()) throw entry.failure.error;

      return this.#load(key, load);
    }

    if (entry.expires <= Date.now() && !entry.pending) {
      this.#load(key, load).catch(() => undefined);
    }

    return entry.value.data;
  }

  #load(key: string, load: () => Promise<T>): Promise<T> {
    const entry = this.#entries.get(key) ?? { expires: 0 };
    if (entry.pending) return entry.pending;

    entry.pending = load()
      .then((data) => {
        entry.value = { data };
        entry.failure = undefined;
        entry.expires = Date.now() + this.ttlSeconds * 1000;

        return data;
      })
      .catch((error: unknown) => {
        const retryAt = Date.now() + FAILURE_BACKOFF_SECONDS * 1000;

        entry.failure = { error, retryAt };
        if (entry.value) entry.expires = retryAt;

        this.onError(key, error);

        throw error;
      })
      .finally(() => {
        entry.pending = undefined;
      });

    this.#entries.set(key, entry);

    return entry.pending;
  }
}
