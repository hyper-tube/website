import { useTranslation } from 'react-i18next';
import { Fragment, type CSSProperties } from 'react';

import { cn } from '~/lib/styles.shared';

const words = (text: string) => text.split(/\s+/).filter(Boolean);

const wordStyle = (index: number) => ({ '--word-index': index }) as CSSProperties;

export function HeroTitle() {
  const { t } = useTranslation('landing');

  const lines = [words(t('hero.titleStart')), words(t('hero.titleEnd'))];

  return (
    <h1 className="text-hero text-balance">
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && ' '}

          <span className={cn('block', lineIndex === 1 && 'text-primary')}>
            {line.map((word, wordIndex) => (
              <Fragment key={`${word}-${wordIndex}`}>
                {wordIndex > 0 && ' '}

                <span
                  data-word={word}
                  className="hero-word"
                  style={wordStyle(wordIndex + (lineIndex > 0 ? lines[0].length : 0))}
                >
                  <span className="hero-word-glyphs">{word}</span>
                </span>
              </Fragment>
            ))}
          </span>
        </Fragment>
      ))}
    </h1>
  );
}
