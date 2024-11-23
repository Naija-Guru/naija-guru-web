export const replaceTextWithSuggestion = (
  text: string,
  replacement: string,
  offset: number,
  length: number
) => text.slice(0, offset) + replacement + text.slice(offset + length);
