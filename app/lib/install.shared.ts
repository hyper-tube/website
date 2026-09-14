import type { ParseKeys } from 'i18next';

import type { PackageFormat } from './platforms.shared';

export const MACOS_BUNDLE = 'ht-music.app';

export interface InstallStep {
  readonly labelKey: ParseKeys<'download'>;
  readonly command?: (file: string) => string;
}

export const INSTALL_STEPS: Record<PackageFormat, readonly InstallStep[]> = {
  exe: [
    { labelKey: 'install.exe.run' },
    { labelKey: 'install.exe.smartscreen' },
    { labelKey: 'install.exe.launch' },
  ],
  dmg: [
    { labelKey: 'install.dmg.open' },
    { labelKey: 'install.dmg.drag' },
    {
      labelKey: 'install.dmg.quarantine',
      command: () => `xattr -dr com.apple.quarantine /Applications/${MACOS_BUNDLE}`,
    },
  ],
  appimage: [
    { labelKey: 'install.appimage.permission', command: (file) => `chmod +x ${file}` },
    { labelKey: 'install.appimage.run', command: (file) => `./${file}` },
  ],
  deb: [
    { labelKey: 'install.deb.install', command: (file) => `sudo apt install ./${file}` },
    { labelKey: 'install.deb.launch' },
  ],
  rpm: [
    { labelKey: 'install.rpm.install', command: (file) => `sudo dnf install ./${file}` },
    { labelKey: 'install.rpm.launch' },
  ],
};
