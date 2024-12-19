import { useCallback, useEffect, useRef } from 'react';

export const useObserveElementsResize = (
  elements: Element[],
  onResize: (el: Element) => void
) => {
  const observerRef = useRef<ResizeObserver | null>(null);

  const handleResize = useCallback(
    (el: Element) => {
      window.requestAnimationFrame(() => {
        onResize(el);
      });
    },
    [onResize]
  );

  useEffect(() => {
    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        handleResize(entry.target);
      }
    });

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  });
};
