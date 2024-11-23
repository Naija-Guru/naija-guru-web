import { z } from 'zod';

export const TSuggestion = z.object({
  message: z.string(),
  replacements: z.array(
    z.object({
      value: z.string(),
    })
  ),
  offset: z.number(),
  length: z.number(),
  context: z.object({
    text: z.string(),
    offset: z.number(),
    length: z.number(),
  }),
  sentence: z.string(),
  type: z.object({
    typeName: z.string(),
  }),
  rule: z.object({
    id: z.string(),
    description: z.string(),
    category: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
});

export type TSuggestion = z.infer<typeof TSuggestion>;

export type TSuggestionCoordinates = {
  top: number;
  left: number;
  height: number;
  width: number;
};
