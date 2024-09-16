import { TMatch } from 'models/match';
import { z } from 'zod';

const TSpellCheckResponse = z.object({
  matches: z.array(TMatch),
});

type TSpellCheckResponse = z.infer<typeof TSpellCheckResponse>;

export const getSpellCheck = async (
  text: string,
  signal?: AbortSignal
): Promise<TSpellCheckResponse> => {
  const res = await fetch(
    `https://spellchecker-1.nl.naija.guru/v2/check?${new URLSearchParams({
      text,
      language: 'pcm-NG',
    }).toString()}`,
    {
      signal,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  const parsedResponse = TSpellCheckResponse.parse(data);

  return parsedResponse;
};
