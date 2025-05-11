import { z } from 'zod';

export const LanguageCodeSchema = z.enum(['en', 'pcm']);
export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export const TranslationSchema = z.object({
  text: z.string(),
  ids: z.array(z.number()),
  verification: z.enum(['FULL', 'PARTIAL', 'NONE']),
});

export const TranslationResponseSchema = z.object({
  data: z.object({
    translation_lang: z.string(),
    translations: z.array(TranslationSchema),
  }),
});

export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;

export interface TranslateParams {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  text: string;
  appLanguage: LanguageCode;
  signal?: AbortSignal;
}

export async function translateText({
  sourceLanguage,
  targetLanguage,
  text,
  appLanguage,
  signal,
}: TranslateParams): Promise<TranslationResponse> {
  if (!text.trim()) {
    return {
      data: {
        translation_lang: targetLanguage,
        translations: [],
      },
    };
  }

  const url = new URL(
    'https://translate-api.naija.guru/translations/v1/search'
  );
  url.searchParams.append('source_lang', sourceLanguage);
  url.searchParams.append('target_lang', targetLanguage);
  url.searchParams.append('text', text);
  url.searchParams.append('app_lang', appLanguage);

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const rawData = await response.json();

  try {
    return TranslationResponseSchema.parse(rawData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('API response validation failed:', error.format());
      throw new Error('Invalid response format from translation service');
    }
    throw error;
  }
}
