import { useEffect } from 'react';

/**
 * useScrollLock hook: locks body scroll when active,
 * and ALWAYS unconditionally restores scroll on unmount, close, or route changes.
 * Avoids any sticky `overflow: hidden` on body.
 */
export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Calculate scrollbar width to prevent layout shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    };
  }, [lock]);
}

/**
 * Utility to forcefully reset body overflow in case any third-party or route change left it locked
 */
export function forceUnlockBodyScroll() {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}
