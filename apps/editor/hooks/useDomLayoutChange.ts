import { useEffect } from 'react';

export const useDomLayoutChange = (callback: () => void) => {
  useEffect(() => {
    window.addEventListener('scroll', callback, true);
    window.addEventListener('resize', callback, true);

    return () => {
      window.removeEventListener('scroll', callback, true);
      window.removeEventListener('resize', callback, true);
    };
  }, [callback]);
};
