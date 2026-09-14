import type { FooterLink as FooterLinkData } from '~/lib/navigation.shared';

import { FooterLink } from './FooterLink';

interface FooterColumnProps {
  title: string;
  links: readonly FooterLinkData[];
}

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-title-small text-on-surface">{title}</h2>

      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.labelKey}>
            <FooterLink link={link} />
          </li>
        ))}
      </ul>
    </div>
  );
}
