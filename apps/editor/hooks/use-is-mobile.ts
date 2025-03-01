import { useMediaQuery } from './use-media-query';

export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};
