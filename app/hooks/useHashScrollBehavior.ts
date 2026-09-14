import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';

export function useHashScrollBehavior(): void {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPathname = useRef(location.pathname);

  useLayoutEffect(() => {
    const samePage = previousPathname.current === location.pathname;
    previousPathname.current = location.pathname;

    if (location.hash && (samePage || navigationType !== 'POP')) return;

    const root = document.documentElement;

    root.style.scrollBehavior = 'auto';
    getComputedStyle(root).getPropertyValue('scroll-behavior');

    const frame = requestAnimationFrame(() => root.style.removeProperty('scroll-behavior'));

    return () => {
      cancelAnimationFrame(frame);
      root.style.removeProperty('scroll-behavior');
    };
  }, [location, navigationType]);
}
