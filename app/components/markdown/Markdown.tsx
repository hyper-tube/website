import { toJsxRuntime, type Components } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import type { Root } from 'hast';
import { useMemo } from 'react';

import { cn } from '~/lib/styles.shared';

import { MarkdownStrong } from './MarkdownStrong';
import { MarkdownLink } from './MarkdownLink';

interface MarkdownProps {
  tree: Root;
  className?: string;
}

const LIST_ITEM = cn(
  'relative pl-5 before:absolute before:top-[0.6em] before:left-1',
  'before:size-1.5 before:rounded-full before:bg-outline',
);

const CODE_BLOCK = cn(
  'my-4 overflow-x-auto rounded-normal bg-surface-container-high p-4 text-body-medium',
  '[&_code]:bg-transparent [&_code]:p-0',
);

const INLINE_CODE =
  'rounded-verysmall bg-surface-container-high px-1.5 py-0.5 font-mono text-[0.9em]';

const COMPONENTS: Partial<Components> = {
  h1: (props) => <h3 className="mt-8 mb-3 text-title-large first:mt-0" {...props} />,
  h2: (props) => <h3 className="mt-8 mb-3 text-title-medium text-primary first:mt-0" {...props} />,
  h3: (props) => <h4 className="mt-6 mb-2 text-title-small first:mt-0" {...props} />,
  h4: (props) => <h5 className="mt-6 mb-2 text-title-small first:mt-0" {...props} />,
  p: (props) => <p className="my-3 first:mt-0 last:mb-0" {...props} />,
  ul: (props) => <ul className="my-3 flex flex-col gap-2 first:mt-0 last:mb-0" {...props} />,
  ol: (props) => <ol className="my-3 flex list-decimal flex-col gap-2 pl-5" {...props} />,
  li: (props) => <li className={LIST_ITEM} {...props} />,
  a: MarkdownLink,
  strong: MarkdownStrong,
  code: (props) => <code className={INLINE_CODE} {...props} />,
  pre: (props) => <pre className={CODE_BLOCK} {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-4 border-l-4 border-primary pl-4 text-on-surface-variant"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-outline-variant" />,
  img: ({ alt, ...props }) => (
    <img alt={alt ?? ''} loading="lazy" className="my-4 rounded-normal" {...props} />
  ),
  table: (props) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-left text-body-medium" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-b border-outline-variant px-3 py-2 text-title-small" {...props} />
  ),
  td: (props) => <td className="border-b border-outline-variant/60 px-3 py-2" {...props} />,
};

export function Markdown({ tree, className }: MarkdownProps) {
  const content = useMemo(
    () => toJsxRuntime(tree, { Fragment, jsx, jsxs, components: COMPONENTS }),
    [tree],
  );

  return <div className={cn('text-body-large text-on-surface', className)}>{content}</div>;
}
