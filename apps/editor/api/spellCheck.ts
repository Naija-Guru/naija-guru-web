import { TSuggestion } from 'models/suggestion';
import { z } from 'zod';

const TSpellCheckResponse = z.object({
  matches: z.array(TSuggestion),
});

type TSpellCheckResponse = z.infer<typeof TSpellCheckResponse>;

export const getSpellCheck = async (
  text: string
): Promise<TSpellCheckResponse> => {
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

  const parsedResponse = TSpellCheckResponse.parse(data);

  return parsedResponse;
};
