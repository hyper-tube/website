import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { DEFAULT_SEED, SCHEME_RULES, schemeFrom, type Scheme } from '../app/lib/palette.shared';

const OUTPUT = resolve('app/styles/palette.css');

const declarations = (scheme: Scheme, indent: string) =>
  Object.entries(scheme)
    .map(([role, hex]) => `${indent}--md-${role}: ${hex};`)
    .join('\n');

const light = declarations(schemeFrom(DEFAULT_SEED, false), '  ');
const dark = declarations(schemeFrom(DEFAULT_SEED, true), '  ');
const systemDark = declarations(schemeFrom(DEFAULT_SEED, true), '    ');

const lightScheme = schemeFrom(DEFAULT_SEED, false);

const properties = Object.entries(lightScheme)
  .map(
    ([role, hex]) =>
      `@property --md-${role} {\n  syntax: '<color>';\n  inherits: true;\n  initial-value: ${hex};\n}`,
  )
  .join('\n\n');

const transitions = Object.keys(SCHEME_RULES)
  .map((role) => `    --md-${role} var(--theme-duration) var(--ease-effects)`)
  .join(',\n');

const tokens = Object.keys(SCHEME_RULES)
  .map((role) => `  --color-${role}: var(--md-${role});`)
  .join('\n');

const css = `${properties}

:root,
[data-theme='light'] {
  color-scheme: light;
${light}
}

[data-theme='dark'] {
  color-scheme: dark;
${dark}
}

@media (prefers-color-scheme: dark) {
  [data-theme='system'] {
    color-scheme: dark;
${systemDark}
  }
}

@utility theme-transition {
  --theme-duration: 600ms;
  transition:
${transitions};
}

@theme inline {
  --color-*: initial;

${tokens}
}
`;

writeFileSync(OUTPUT, css);

console.log(`Wrote ${Object.keys(SCHEME_RULES).length} roles to ${OUTPUT}`);
