import CropSquareIcon from '~icons/material-symbols/crop-square-outline';
import RemoveIcon from '~icons/material-symbols/remove-rounded';
import CloseIcon from '~icons/material-symbols/close-rounded';

import { SITE_NAME } from '~/lib/site.shared';
import { Logo } from '~/components/ui/Logo';

const WINDOW_BUTTONS = [
  { Icon: RemoveIcon, size: 'size-3.5' },
  { Icon: CropSquareIcon, size: 'size-3' },
  { Icon: CloseIcon, size: 'size-3.5' },
];

const WINDOW_BUTTON =
  'grid size-6 place-items-center rounded-full bg-surface-container text-on-surface';

export function DemoTitleBar() {
  return (
    <div aria-hidden className="flex h-11 items-center justify-between px-4">
      <div className="flex items-center gap-2 text-label-medium text-on-surface-variant">
        <Logo className="size-[18px]" />
        {SITE_NAME}
      </div>

      <div className="flex gap-2">
        {WINDOW_BUTTONS.map(({ Icon, size }, index) => (
          <span key={index} className={WINDOW_BUTTON}>
            <Icon className={size} />
          </span>
        ))}
      </div>
    </div>
  );
}
