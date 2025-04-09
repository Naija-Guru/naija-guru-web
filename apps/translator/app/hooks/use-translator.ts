import { useState, useCallback, useEffect } from 'react';
import {
  translateText,
  LanguageCode,
  LanguageCodeSchema,
} from '../api/translation';
import { z } from 'zod';

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
}

export function useTranslator(
  initialSourceLang: LanguageCode = 'en',
  initialTargetLang: LanguageCode = 'pcm'
): UseTranslatorResult {
  // Validate language codes with Zod
  try {
    LanguageCodeSchema.parse(initialSourceLang);
    LanguageCodeSchema.parse(initialTargetLang);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid language code:', error.format());
    }
    // Fallback to defaults if invalid
    initialSourceLang = 'en';
    initialTargetLang = 'pcm';
  }

  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [alternateTranslations, setAlternateTranslations] = useState<string[]>(
    []
  );
  const [verification, setVerification] = useState<'FULL' | 'PARTIAL' | 'NONE'>(
    'NONE'
  );
  const [sourceLanguage, setSourceLanguage] =
    useState<LanguageCode>(initialSourceLang);
  const [targetLanguage, setTargetLanguage] =
    useState<LanguageCode>(initialTargetLang);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      setAlternateTranslations([]);
      setVerification('NONE');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await translateText({
        sourceLanguage,
        targetLanguage,
        text: sourceText,
        appLanguage: 'en', // Hard-coded to English
      });

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
      setIsLoading(false);
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  // Perform translation when source text or languages change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      translate();
    }, 500); // debounce translation requests

    return () => clearTimeout(timeoutId);
  }, [translate]);

  const switchLanguages = useCallback(() => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    // Translation will be triggered by the effect
  }, [sourceLanguage, targetLanguage, translatedText]);

  const clearText = useCallback(() => {
    setSourceText('');
    setTranslatedText('');
    setAlternateTranslations([]);
    setVerification('NONE');
  }, []);

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
  };
}
