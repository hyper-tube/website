import { detectPlatform, type PlatformId } from './platforms.shared';

export function detectRequestPlatform(request: Request): PlatformId | null {
  return detectPlatform(
    request.headers.get('user-agent'),
    request.headers.get('sec-ch-ua-platform'),
  );
}
