import { isClient } from '@/lib/utils';
import { useEffect, useState } from 'react';

/**
 * Custom hook that checks if a media query matches.
 *
 * @param {string} query - The media query to check
 * @returns {boolean} - Whether the media query matches
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (for SSR)
    if (!isClient()) {
      return;
    }

    // Create a media query list
    const mediaQueryList = window.matchMedia(query);

    // Set the initial value
    setMatches(mediaQueryList.matches);

    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener to media query list
    mediaQueryList.addEventListener('change', listener);

    // Clean up function
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
