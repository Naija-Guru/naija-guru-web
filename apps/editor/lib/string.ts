export const replaceTextWithSuggestion = (
  text: string,
  replacement: string,
  offset: number,
  length: number
) => text.slice(0, offset) + replacement + text.slice(offset + length);

export const formatEnumToText = (text: string): string => {
  if (!text) return '';

  return text
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
