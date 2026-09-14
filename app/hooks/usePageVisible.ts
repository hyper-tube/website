import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange);

  return () => document.removeEventListener('visibilitychange', onChange);
};

const isVisible = () => document.visibilityState === 'visible';
const assumeVisible = () => true;

export function usePageVisible(): boolean {
  return useSyncExternalStore(subscribe, isVisible, assumeVisible);
}
