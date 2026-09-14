import type { Element, ElementContent, Root, RootContent, Text } from 'hast';
import rehypeSanitize from 'rehype-sanitize';
import remarkGithub from 'remark-github';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';

const COMMIT_SHA = /^[0-9a-f]{7,40}$/i;
const SCOPE = /^\(([\w./-]+)\)$/;

const processors = new Map<string, ReturnType<typeof createProcessor>>();

function createProcessor(repository: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, { repository })
    .use(remarkRehype)
    .use(rehypeSanitize);
}

function processorFor(repository: string) {
  let processor = processors.get(repository);

  if (!processor) {
    processor = createProcessor(repository);
    processors.set(repository, processor);
  }

  return processor;
}

const isElement = (node: RootContent | ElementContent | undefined, tagName?: string) =>
  node?.type === 'element' && (!tagName || node.tagName === tagName);

const isText = (node: RootContent | ElementContent | undefined): node is Text =>
  node?.type === 'text';

const textOf = (node: Element): string =>
  node.children.map((child) => (isText(child) ? child.value : '')).join('');

const isBlank = (node: RootContent) => isText(node) && node.value.trim() === '';

function tidyCliffMarkup(parent: Root | Element): void {
  const { children } = parent;

  children.forEach((child, index) => {
    if (child.type !== 'element') return;

    const scope = isElement(child, 'strong') ? SCOPE.exec(textOf(child)) : null;

    if (scope) {
      child.properties = { ...child.properties, dataScope: scope[1] };
      child.children = [{ type: 'text', value: scope[1] }];
    }

    const before = children[index - 1];
    const after = children[index + 1];

    if (isElement(child, 'a') && COMMIT_SHA.test(textOf(child)) && isText(before)) {
      before.value = before.value.replace(/\s*-\s*\($/, ' ');
      if (isText(after)) after.value = after.value.replace(/^\)/, '');
    }

    tidyCliffMarkup(child);
  });
}

function withoutPositions(tree: Root): Root {
  return JSON.parse(JSON.stringify(tree, (key, value) => (key === 'position' ? undefined : value)));
}

export function parseReleaseNotes(source: string, repository: string): Root | null {
  if (!source.trim()) return null;

  const processor = processorFor(repository);
  const tree = processor.runSync(processor.parse(source)) as Root;

  const firstContent = tree.children.findIndex((node) => !isBlank(node));

  if (firstContent !== -1 && isElement(tree.children[firstContent], 'h1')) {
    tree.children.splice(0, firstContent + 1);
  }

  if (!tree.children.some((node) => !isBlank(node))) return null;

  tidyCliffMarkup(tree);

  return withoutPositions(tree);
}
