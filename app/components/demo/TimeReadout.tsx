import { useWholeSeconds } from '~/hooks/useWholeSeconds';
import { useDemoPlayer } from '~/providers/demo-player';
import { formatTime } from '~/lib/playground.shared';

export function TimeReadout() {
  const { track, position } = useDemoPlayer();
  const seconds = useWholeSeconds(position);

  return (
    <span className="text-label-medium text-on-surface-variant tabular-nums">
      {formatTime(seconds)} / {formatTime(track.duration)}
    </span>
  );
}
