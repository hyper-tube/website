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

export interface ServerCookieAttributes extends CookieAttributes {
  httpOnly?: boolean;
}

export interface ServerCookieOptions<T> extends ServerCookieAttributes {
  parse?: (value: string) => T;

  serialize?: (value: T) => string;
}

export interface ServerCookie<T> {
  readonly name: string;

  parse(request: Request): T | undefined;

  parseHeader(cookieHeader: string | null): T | undefined;

  serialize(value: T, attributes?: ServerCookieAttributes): string;
}

const DEFAULT_COOKIE_ATTRIBUTES: CookieAttributes = {
  path: '/',
  sameSite: 'lax',
};

function getCookieValue(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

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

function serializeCookie(name: string, value: string, attributes: ServerCookieAttributes): string {
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

  if (attributes.httpOnly) {
    parts.push('HttpOnly');
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

export function createCookie<T>(
  name: string,
  options: ServerCookieOptions<T> = {},
): ServerCookie<T> {
  const attributes = { ...DEFAULT_COOKIE_ATTRIBUTES, ...options };
  const parse = options.parse ?? ((value: string) => value as T);
  const serialize = options.serialize ?? ((value: T) => String(value));

  return {
    name,
    parse(request) {
      return this.parseHeader(request.headers.get('Cookie'));
    },
    parseHeader(cookieHeader) {
      const value = getCookieValue(cookieHeader, name);
      return value === undefined ? undefined : parse(value);
    },
    serialize(value, overrides = {}) {
      const serializedValue = serialize(value);

      return serializeCookie(name, serializedValue, {
        ...attributes,
        ...overrides,
      });
    },
  };
}
