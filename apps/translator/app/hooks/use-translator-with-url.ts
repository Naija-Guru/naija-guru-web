// filepath: /Users/johnayeni/projects/naija-spell-checker/apps/translator/app/hooks/use-translator-with-url.ts
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  translateText,
  LanguageCode,
  LanguageCodeSchema,
} from '../api/translation';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

interface UseTranslatorResult {
  sourceText: string;
  translatedText: string;
  alternateTranslations: string[];
  verification: 'FULL' | 'PARTIAL' | 'NONE';
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  isLoading: boolean;
  error: string | null;
  setSourceText: (text: string) => void;
  switchLanguages: () => void;
  clearText: () => void;
  shareLink: string;
}

export function useTranslatorWithUrl(
  defaultSourceLang: LanguageCode = 'en',
  defaultTargetLang: LanguageCode = 'pcm'
): UseTranslatorResult {
  // Get URL search params and router for updating URL
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse URL parameters with fallbacks to defaults
  const initialSourceLang = parseLanguageCode(
    searchParams.get('source'),
    defaultSourceLang
  );
  const initialTargetLang = parseLanguageCode(
    searchParams.get('target'),
    defaultTargetLang
  );
  const initialSourceText = searchParams.get('text') || '';

  // State setup
  const [sourceText, setSourceTextState] = useState<string>(initialSourceText);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [alternateTranslations, setAlternateTranslations] = useState<string[]>(
    []
  );
  const [verification, setVerification] = useState<'FULL' | 'PARTIAL' | 'NONE'>(
    'NONE'
  );
  const [sourceLanguage, setSourceLanguageState] =
    useState<LanguageCode>(initialSourceLang);
  const [targetLanguage, setTargetLanguageState] =
    useState<LanguageCode>(initialTargetLang);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate share link based on current state
  const shareLink = createShareLink(sourceLanguage, targetLanguage, sourceText);

  // Reference to the current abort controller
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reference to track the last translation request ID
  const translationRequestIdRef = useRef<number>(0);

  // Update URL when source text or languages change
  const updateURL = useCallback(
    (text: string, sourceLang: LanguageCode, targetLang: LanguageCode) => {
      // Create new URLSearchParams
      const params = new URLSearchParams();

      // Only add parameters if they have values
      if (text) params.set('text', text);
      params.set('source', sourceLang);
      params.set('target', targetLang);

      // Update URL without refreshing the page
      router.replace(`/?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  // Wrapper for setting source text that also updates URL
  const setSourceText = useCallback(
    (text: string) => {
      setSourceTextState(text);
      updateURL(text, sourceLanguage, targetLanguage);
    },
    [sourceLanguage, targetLanguage, updateURL]
  );

  const translate = useCallback(async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      setAlternateTranslations([]);
      setVerification('NONE');
      return;
    }

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Generate a unique ID for this request
    const currentRequestId = ++translationRequestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const response = await translateText({
        sourceLanguage,
        targetLanguage,
        text: sourceText,
        appLanguage: 'en', // Hard-coded to English
        signal, // Pass the abort signal
      });

      // Check if this response is for the most recent request
      if (currentRequestId !== translationRequestIdRef.current) {
        return; // Ignore outdated responses
      }

      const translations = response.data.translations;
      if (translations.length > 0) {
        setTranslatedText(translations[0].text);
        setVerification(translations[0].verification);

        // Store alternate translations if there are any
        if (translations.length > 1) {
          setAlternateTranslations(
            translations.slice(1).map((translation) => translation.text)
          );
        } else {
          setAlternateTranslations([]);
        }
      } else {
        setTranslatedText('');
        setAlternateTranslations([]);
        setVerification('NONE');
      }
    } catch (err) {
      // Ignore errors from aborted requests
      if ((err as Error).name === 'AbortError') {
        return;
      }

      let errorMessage = 'An error occurred during translation';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err instanceof z.ZodError) {
        errorMessage = 'Invalid response format from the translation service';
        console.error('API response validation failed:', err.format());
      }

      setError(errorMessage);
      setTranslatedText('');
      setAlternateTranslations([]);
    } finally {
      // Only update isLoading if this is the most recent request
      if (currentRequestId === translationRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  // Perform translation when source text or languages change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      translate();
    }, 500); // debounce translation requests

    return () => {
      clearTimeout(timeoutId);
      // Clean up any ongoing request when dependencies change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [translate]);

  const switchLanguages = useCallback(() => {
    // Swap languages
    const newSourceLang = targetLanguage;
    const newTargetLang = sourceLanguage;
    const newSourceText = translatedText;

    // Update state
    setSourceLanguageState(newSourceLang);
    setTargetLanguageState(newTargetLang);
    setSourceTextState(newSourceText);

    // Update URL
    updateURL(newSourceText, newSourceLang, newTargetLang);
    // Translation will be triggered by the effect
  }, [sourceLanguage, targetLanguage, translatedText, updateURL]);

  const clearText = useCallback(() => {
    setSourceTextState('');
    setTranslatedText('');
    setAlternateTranslations([]);
    setVerification('NONE');

    // Update URL to remove text parameter
    updateURL('', sourceLanguage, targetLanguage);

    // Abort any ongoing translation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [sourceLanguage, targetLanguage, updateURL]);

  return {
    sourceText,
    translatedText,
    alternateTranslations,
    verification,
    sourceLanguage,
    targetLanguage,
    isLoading,
    error,
    setSourceText,
    switchLanguages,
    clearText,
    shareLink,
  };
}

// Helper function to validate and parse language codes from URL
function parseLanguageCode(
  value: string | null,
  defaultValue: LanguageCode
): LanguageCode {
  if (!value) return defaultValue;

  try {
    return LanguageCodeSchema.parse(value) as LanguageCode;
  } catch (error) {
    console.warn(`Invalid language code in URL: ${value}`, error);
    return defaultValue;
  }
}

// Create a shareable URL with current translation state
function createShareLink(
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  text: string
): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const params = new URLSearchParams();
  params.set('source', sourceLang);
  params.set('target', targetLang);
  if (text) params.set('text', text);

  return `${baseUrl}/?${params.toString()}`;
}
