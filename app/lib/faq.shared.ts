export const FAQ_CATEGORIES = [
  { id: 'start', items: ['what-is', 'free', 'premium', 'systems', 'updates'] },
  { id: 'privacy', items: ['sign-in', 'data'] },
  { id: 'features', items: ['native', 'offline', 'desktop'] },
  { id: 'help', items: ['macos', 'problem'] },
] as const;

export type FaqId = (typeof FAQ_CATEGORIES)[number]['items'][number];

export const FEATURED_FAQ: readonly FaqId[] = ['what-is', 'free', 'premium', 'sign-in', 'systems'];

export function faqIdFromHash(hash: string): FaqId | null {
  const id = hash.replace(/^#/, '');

  return FAQ_CATEGORIES.some((category) => (category.items as readonly string[]).includes(id))
    ? (id as FaqId)
    : null;
}
