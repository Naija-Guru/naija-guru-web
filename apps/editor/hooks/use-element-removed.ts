import { useEffect } from 'react';

export function useElementRemoved(
  containerEl: HTMLElement,
  callback: (node: Node) => void
) {
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((removedNode) => {
            callback(removedNode);
          });
        }
      }
    });

    observer.observe(containerEl, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [callback, containerEl]);
}
