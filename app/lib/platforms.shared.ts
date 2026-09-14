export const PLATFORMS = ['windows', 'macos', 'linux'] as const;

export type PlatformId = (typeof PLATFORMS)[number];

export const PACKAGE_FORMATS = ['exe', 'dmg', 'appimage', 'deb', 'rpm'] as const;

export type PackageFormat = (typeof PACKAGE_FORMATS)[number];

export type Architecture = 'x64' | 'arm64';

export const PLATFORM_FORMATS: Record<PlatformId, readonly PackageFormat[]> = {
  windows: ['exe'],
  macos: ['dmg'],
  linux: ['appimage', 'deb', 'rpm'],
};

const FORMAT_EXTENSIONS: Record<PackageFormat, RegExp> = {
  exe: /\.exe$/i,
  dmg: /\.dmg$/i,
  appimage: /\.appimage$/i,
  deb: /\.deb$/i,
  rpm: /\.rpm$/i,
};

const ARCHITECTURES: readonly [Architecture, RegExp][] = [
  ['arm64', /(?:arm64|aarch64)/i],
  ['x64', /(?:x86_64|amd64|x64)/i],
];

export interface AssetKind {
  readonly platform: PlatformId;
  readonly format: PackageFormat;
  readonly arch: Architecture;
}

export function platformOf(format: PackageFormat): PlatformId {
  return PLATFORMS.find((platform) => PLATFORM_FORMATS[platform].includes(format)) ?? 'linux';
}

export function classifyAsset(name: string): AssetKind | null {
  const format = PACKAGE_FORMATS.find((candidate) => FORMAT_EXTENSIONS[candidate].test(name));
  if (!format) return null;

  const arch = ARCHITECTURES.find(([, pattern]) => pattern.test(name))?.[0] ?? 'x64';

  return { platform: platformOf(format), format, arch };
}

export function detectPlatform(
  userAgent: string | null,
  platformHint: string | null,
): PlatformId | null {
  const hint = platformHint?.replaceAll('"', '').toLowerCase();

  if (hint === 'windows') return 'windows';
  if (hint === 'macos') return 'macos';
  if (hint === 'linux') return 'linux';
  if (hint === 'android' || hint === 'ios' || hint === 'chrome os') return null;

  if (!userAgent || /android|iphone|ipad|ipod|mobile/i.test(userAgent)) return null;
  if (/windows nt/i.test(userAgent)) return 'windows';
  if (/macintosh|mac os x/i.test(userAgent)) return 'macos';
  if (/linux|x11/i.test(userAgent)) return 'linux';

  return null;
}
