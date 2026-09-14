import { cn } from '~/lib/styles.shared';

interface PlayingBarsProps {
  playing: boolean;
  className?: string;
}

const BAR = cn(
  'h-full w-[3px] origin-bottom rounded-full bg-current',
  'animate-playing-bar motion-reduce:animate-none',
);

const DELAYS = ['0ms', '-300ms', '-600ms'];

export function PlayingBars({ playing, className }: PlayingBarsProps) {
  return (
    <span aria-hidden className={cn('flex h-4 items-end gap-[3px]', className)}>
      {DELAYS.map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: delay, animationPlayState: playing ? 'running' : 'paused' }}
          className={BAR}
        />
      ))}
    </span>
  );
}
