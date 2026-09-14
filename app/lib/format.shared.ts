const BYTE_UNITS = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const;

export function formatBytes(bytes: number, locale: string): string {
  const exponent = Math.min(
    Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  );

  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: BYTE_UNITS[exponent],
    unitDisplay: 'short',
    maximumFractionDigits: exponent >= 3 ? 1 : 0,
  }).format(bytes / 1024 ** exponent);
}

export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(iso),
  );
}

export function formatCompact(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatUnit(
  value: number,
  unit: string,
  locale: string,
  fractionDigits = 0,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: 'short',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
