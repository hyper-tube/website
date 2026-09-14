export type CookieSameSite = 'lax' | 'strict' | 'none';

export type CookiePriority = 'low' | 'medium' | 'high';

export interface CookieAttributes {
  domain?: string;

  expires?: Date;

  maxAge?: number;

  path?: string;

  sameSite?: CookieSameSite;

  secure?: boolean;

  partitioned?: boolean;

  priority?: CookiePriority;
}

export interface ClientCookieOptions<T> extends CookieAttributes {
  get?: (value: string) => T;

  set?: (value: T) => string;
}

export interface ClientCookie<T> {
  readonly name: string;

  get(): T | undefined;

  set(value: T, attributes?: CookieAttributes): void;
}

const DEFAULT_COOKIE_ATTRIBUTES: CookieAttributes = {
  path: '/',
  sameSite: 'lax',
};

function getCookieValue(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');

    if (separator === -1 || part.slice(0, separator).trim() !== name) {
      continue;
    }

    let value = part.slice(separator + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    try {
      return decodeURIComponent(value);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function serializeCookie(name: string, value: string, attributes: CookieAttributes): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (attributes.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.floor(attributes.maxAge)}`);
  }

  if (attributes.domain) {
    parts.push(`Domain=${attributes.domain}`);
  }

  if (attributes.path) {
    parts.push(`Path=${attributes.path}`);
  }

  if (attributes.expires) {
    parts.push(`Expires=${attributes.expires.toUTCString()}`);
  }

  if (attributes.secure) {
    parts.push('Secure');
  }

  if (attributes.sameSite) {
    parts.push(`SameSite=${capitalize(attributes.sameSite)}`);
  }

  if (attributes.partitioned) {
    parts.push('Partitioned');
  }

  if (attributes.priority) {
    parts.push(`Priority=${capitalize(attributes.priority)}`);
  }

  return parts.join('; ');
}

function capitalize(value: string): string {
  return value[0].toUpperCase() + value.slice(1);
}

function ensureDocument(): Document {
  if (typeof document === 'undefined') {
    throw new Error('Client cookies can only be used in a browser.');
  }

  return document;
}

export function createCookie<T>(
  name: string,
  options: ClientCookieOptions<T> = {},
): ClientCookie<T> {
  const attributes = { ...DEFAULT_COOKIE_ATTRIBUTES, ...options };
  const get = options.get ?? ((value: string) => value as T);
  const set = options.set ?? ((value: T) => String(value));

  return {
    name,
    get() {
      const value = getCookieValue(ensureDocument().cookie, name);
      return value === undefined ? undefined : get(value);
    },
    set(value, overrides = {}) {
      const serializedValue = set(value);

      ensureDocument().cookie = serializeCookie(name, serializedValue, {
        ...attributes,
        ...overrides,
      });
    },
  };
}
