import { useCallback, useEffect } from 'react';

export const useListenToElementsScroll = (
  elements: Element[],
  onScroll: (el: Element) => void
) => {
  const handleScroll = useCallback(
    (el: Element) => {
      window.requestAnimationFrame(() => {
        onScroll(el);
      });
    },
    [onScroll]
  );

  useEffect(() => {
    for (const el of elements) {
      el.addEventListener('scroll', () => handleScroll(el));
      const parent = el.parentElement;
      if (parent) {
        parent.addEventListener('scroll', () => handleScroll(el));
      }
    }
    return () => {
      for (const el of elements) {
        el.removeEventListener('scroll', () => handleScroll(el));
        const parent = el.parentElement;
        if (parent) {
          parent.addEventListener('scroll', () => handleScroll(el));
        }
      }
    };
  }, [elements, handleScroll]);
};
