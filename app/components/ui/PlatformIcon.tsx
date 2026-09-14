import WindowsIcon from '~icons/mdi/microsoft-windows';
import AppleIcon from '~icons/mdi/apple';
import LinuxIcon from '~icons/mdi/linux';
import type { SVGProps } from 'react';

import type { PlatformId } from '~/lib/platforms.shared';

const ICONS = {
  windows: WindowsIcon,
  macos: AppleIcon,
  linux: LinuxIcon,
} satisfies Record<PlatformId, unknown>;

interface PlatformIconProps extends SVGProps<SVGSVGElement> {
  platform: PlatformId;
}

export function PlatformIcon({ platform, ...props }: PlatformIconProps) {
  const Icon = ICONS[platform];

  return <Icon aria-hidden {...props} />;
}
