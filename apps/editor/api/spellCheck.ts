import { getSavedPreferencesState } from '@/lib/storage';
import { TSuggestion } from 'models/suggestion';
import { z } from 'zod';

const TSpellingSuggestionsResponse = z.object({
  matches: z.array(TSuggestion),
});

type TSpellingSuggestionsResponse = z.infer<
  typeof TSpellingSuggestionsResponse
>;

export const getSpellingSuggestions = async (
  text: string
): Promise<TSpellingSuggestionsResponse> => {
  const endpoint =
    getSavedPreferencesState().customSpellCheckApiEndpoint ??
    process.env.NEXT_PUBLIC_SPELL_CHECK_API_ENDPOINT;

  const res = await fetch(
    `${endpoint}?${new URLSearchParams({
      text,
      language: 'pcm-NG',
    }).toString()}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data);
  }

  const parsedResponse = TSpellingSuggestionsResponse.parse(data);

  return parsedResponse;
};
