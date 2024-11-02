import { useEffect } from 'react';

export const useObserveContentEditableElements = (
  handleObserveElement: (el: HTMLElement) => void
) => {
  useEffect(() => {
    document
      .querySelectorAll('[contenteditable="true"]')
      .forEach((el) => handleObserveElement(el as HTMLElement));

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLElement &&
              node.getAttribute('contenteditable') === 'true'
            ) {
              handleObserveElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [handleObserveElement]);
};
