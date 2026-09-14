export const LEGAL_UPDATED = '2026-09-14';

export const TERMS_SECTIONS = [
  'about',
  'service',
  'youtube',
  'license',
  'downloads',
  'warranty',
  'liability',
  'changes',
] as const;

export const PRIVACY_SECTIONS = [
  'stored',
  'google',
  'connections',
  'crashes',
  'website',
  'children',
  'changes',
] as const;

export interface LegalSection {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export function paragraphs(body: string): string[] {
  return body.split(/\n{2,}/).filter(Boolean);
}
