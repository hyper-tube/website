import { scallopPath } from '~/lib/shapes.shared';
import { cn } from '~/lib/styles.shared';

interface DemoArtworkProps {
  cover: number;
  className?: string;
}

const COOKIE = scallopPath(50, 30, 9, 3.2);

const COVERS = [
  <>
    <rect width="100" height="100" className="fill-primary-container" />
    <circle cx="62" cy="44" r="30" className="fill-primary" />
    <circle cx="30" cy="72" r="14" className="fill-tertiary" />
  </>,
  <>
    <rect width="100" height="100" className="fill-tertiary-container" />
    <path d={COOKIE} className="fill-tertiary" />
    <circle cx="50" cy="50" r="10" className="fill-tertiary-container" />
  </>,
  <>
    <rect width="100" height="100" className="fill-secondary-container" />
    <rect x="18" y="22" width="64" height="14" rx="7" className="fill-secondary" />
    <rect x="18" y="43" width="44" height="14" rx="7" className="fill-primary" />
    <rect x="18" y="64" width="54" height="14" rx="7" className="fill-secondary" />
  </>,
  <>
    <rect width="100" height="100" className="fill-primary" />
    <path d="M24 84V52a26 26 0 0 1 52 0v32Z" className="fill-on-primary" />
    <circle cx="50" cy="52" r="10" className="fill-primary" />
  </>,
  <>
    <rect width="100" height="100" className="fill-surface-container-highest" />
    <circle cx="38" cy="38" r="17" className="fill-primary" />
    <circle cx="62" cy="38" r="17" className="fill-tertiary" />
    <circle cx="38" cy="62" r="17" className="fill-tertiary" />
    <circle cx="62" cy="62" r="17" className="fill-primary" />
  </>,
];

export function DemoArtwork({ cover, className }: DemoArtworkProps) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={cn('shrink-0 overflow-hidden', className)}>
      {COVERS[cover % COVERS.length]}
    </svg>
  );
}
