import { z } from 'zod';

export const TSuggestionRuleCategory = z.object({
  id: z.string(),
  name: z.string(),
});

export type TSuggestionRuleCategory = z.infer<typeof TSuggestionRuleCategory>;

export const TSuggestionRule = z.object({
  id: z.string(),
  description: z.string(),
  category: TSuggestionRuleCategory,
});

export type TSuggestionRule = z.infer<typeof TSuggestionRule>;

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
  rule: TSuggestionRule,
});

export type TSuggestion = z.infer<typeof TSuggestion>;

export type TSuggestionCoordinates = {
  top: number;
  left: number;
  height: number;
  width: number;
};
