import type { ComponentType, CSSProperties, SVGProps } from 'react';

interface MoreFeatureProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  index: number;
  title: string;
  description: string;
}

const COLUMNS = 4;

const revealStyle = (index: number) => ({ '--reveal-index': index % COLUMNS }) as CSSProperties;

export function MoreFeature({ icon: Icon, index, title, description }: MoreFeatureProps) {
  return (
    <li
      style={revealStyle(index)}
      className="scroll-reveal flex flex-col gap-3 border-t border-outline-variant pt-6"
    >
      <Icon aria-hidden className="size-7 text-primary" />
      <h3 className="text-title-large">{title}</h3>
      <p className="text-body-medium text-pretty text-on-surface-variant">{description}</p>
    </li>
  );
}
