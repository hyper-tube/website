import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import { faqIdFromHash, type FaqId } from '~/lib/faq.shared';
import { AccordionItem } from '~/components/ui/AccordionItem';

import { FaqAnswer } from './FaqAnswer';

interface FaqListProps {
  items: readonly FaqId[];
  initiallyOpen?: readonly FaqId[];
  headingLevel?: 'h2' | 'h3';
  anchors?: boolean;
}

const withItem = (set: ReadonlySet<FaqId>, id: FaqId) => new Set(set).add(id);

const toggled = (set: ReadonlySet<FaqId>, id: FaqId) => {
  const next = new Set(set);
  if (!next.delete(id)) next.add(id);

  return next;
};

export function FaqList({
  items,
  initiallyOpen = [],
  headingLevel,
  anchors = false,
}: FaqListProps) {
  const { t } = useTranslation('faq');
  const [open, setOpen] = useState<ReadonlySet<FaqId>>(() => new Set(initiallyOpen));

  useEffect(() => {
    if (!anchors) return;

    const openLinked = () => {
      const id = faqIdFromHash(window.location.hash);
      if (id && items.includes(id)) setOpen((current) => withItem(current, id));
    };

    const frame = requestAnimationFrame(openLinked);
    window.addEventListener('hashchange', openLinked);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', openLinked);
    };
  }, [anchors, items]);

  return (
    <div className="flex flex-col">
      {items.map((id) => (
        <AccordionItem
          key={id}
          id={anchors ? id : undefined}
          title={t(`items.${id}.question`)}
          open={open.has(id)}
          onToggle={() => setOpen((current) => toggled(current, id))}
          headingLevel={headingLevel}
        >
          <FaqAnswer id={id} />
        </AccordionItem>
      ))}
    </div>
  );
}
