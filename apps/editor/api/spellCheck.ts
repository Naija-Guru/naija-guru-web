import { replaceTextWithSuggestion } from '@/lib/string';
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
  const res = await fetch(
    `https://spellchecker-1.nl.naija.guru/v2/check?${new URLSearchParams({
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
