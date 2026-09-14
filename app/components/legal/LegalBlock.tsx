import { paragraphs, type LegalSection } from '~/lib/legal.shared';

interface LegalBlockProps {
  section: LegalSection;
  index: number;
}

export function LegalBlock({ section, index }: LegalBlockProps) {
  return (
    <section id={section.id} className="flex scroll-mt-28 flex-col gap-3">
      <h2 className="flex items-baseline gap-3 text-headline-small">
        <span className="text-title-medium text-primary tabular-nums">{index + 1}</span>
        {section.title}
      </h2>

      {paragraphs(section.body).map((paragraph) => (
        <p key={paragraph} className="text-body-large text-pretty text-on-surface-variant">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
