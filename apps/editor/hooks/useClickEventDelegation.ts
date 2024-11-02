import { useEffect } from 'react';

export const useClickEventDelegation = (callback: (e: MouseEvent) => void) => {
  useEffect(() => {
    document.addEventListener('click', callback);
    return () => {
      document.removeEventListener('click', callback);
    };
  }, [callback]);
};
