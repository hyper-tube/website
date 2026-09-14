import type { ComponentProps } from 'react';

interface MarkdownStrongProps extends ComponentProps<'strong'> {
  'data-scope'?: string;
}

export function MarkdownStrong({ 'data-scope': scope, ...props }: MarkdownStrongProps) {
  if (scope) {
    return <span className="mr-1.5 text-label-large text-on-surface-variant">{scope}</span>;
  }

  return <strong className="font-semibold" {...props} />;
}
