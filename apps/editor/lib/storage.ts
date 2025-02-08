import { z } from 'zod';

const PREFERENCES_STORAGE_KEY = 'naija-guru-spellchecker/preferences';

export const preferencesReducerInitialState: TPreferencesState = {
  customSpellCheckApiEndpoint: null,
  ignoredCategories: [],
  ignoredRules: [],
};

export const TPreferencesState = z
  .object({
    customSpellCheckApiEndpoint: z.union([z.string().url(), z.null()]),
    ignoredCategories: z.array(z.string()),
    ignoredRules: z.array(z.string()),
  })
  .catch(() => {
    return preferencesReducerInitialState;
  });

export type TPreferencesState = z.infer<typeof TPreferencesState>;

export const getSavedPreferencesState = () => {
  const localStorageState = localStorage.getItem(PREFERENCES_STORAGE_KEY);

  const validatedState = TPreferencesState.parse(
    localStorageState ? JSON.parse(localStorageState) : null
  );

  return validatedState;
};

export const setSavedPreferencesState = (state: TPreferencesState) => {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
};
