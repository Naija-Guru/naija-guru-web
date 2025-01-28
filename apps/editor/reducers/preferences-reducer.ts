import { TSuggestionRule, TSuggestionRuleCategory } from '@/models/suggestion';
import { useEffect, useReducer } from 'react';
import { z } from 'zod';

const STORAGE_KEY = 'naija-guru-spellchecker/preferences';

export const preferencesReducerInitialState: TPreferencesReducer = {
  customUrl: null,
  ignoredCategories: [],
  ignoredRules: [],
};

export const TPreferencesReducer = z
  .object({
    customUrl: z.union([z.string(), z.null()]),
    ignoredCategories: z.array(TSuggestionRuleCategory),
    ignoredRules: z.array(TSuggestionRule),
  })
  .catch(() => {
    return preferencesReducerInitialState;
  });

export type TPreferencesReducer = z.infer<typeof TPreferencesReducer>;

const createInitialState = (): TPreferencesReducer => {
  const localStorageState = localStorage.getItem(STORAGE_KEY);

  const validatedState = TPreferencesReducer.parse(
    localStorageState ? JSON.parse(localStorageState) : null
  );

  return validatedState;
};

export type PreferencesReducerState = typeof preferencesReducerInitialState;

export type PreferencesReducerAction =
  | { type: 'SET_CUSTOM_URL'; payload: { url: string } }
  | {
      type: 'ADD_IGNORED_CATEGORY';
      payload: { category: TSuggestionRuleCategory };
    }
  | { type: 'REMOVE_IGNORED_CATEGORY'; payload: { categoryId: string } }
  | { type: 'CLEAR_IGNORED_CATEGORIES' }
  | { type: 'ADD_IGNORED_RULE'; payload: { rule: TSuggestionRule } }
  | { type: 'REMOVE_IGNORED_RULE'; payload: { ruleId: string } }
  | { type: 'CLEAR_IGNORED_RULES' };

export function preferencesReducer(
  state: PreferencesReducerState,
  action: PreferencesReducerAction
): PreferencesReducerState {
  switch (action.type) {
    case 'SET_CUSTOM_URL':
      return { ...state, customUrl: action.payload.url };
    case 'ADD_IGNORED_CATEGORY':
      return {
        ...state,
        ignoredCategories: [
          ...state.ignoredCategories,
          action.payload.category,
        ],
      };
    case 'REMOVE_IGNORED_CATEGORY':
      return {
        ...state,
        ignoredCategories: state.ignoredCategories.filter(
          (category) => category.id === action.payload.categoryId
        ),
      };
    case 'CLEAR_IGNORED_CATEGORIES':
      return {
        ...state,
        ignoredCategories: [],
      };
    case 'ADD_IGNORED_RULE':
      return {
        ...state,
        ignoredRules: [...state.ignoredRules, action.payload.rule],
      };
    case 'REMOVE_IGNORED_RULE':
      return {
        ...state,
        ignoredRules: state.ignoredRules.filter(
          (rule) => rule.id === action.payload.ruleId
        ),
      };
    case 'CLEAR_IGNORED_RULES':
      return {
        ...state,
        ignoredRules: [],
      };
    default:
      return state;
  }
}

export const usePreferencesReducer = () => {
  const [state, dispatch] = useReducer(
    preferencesReducer,
    createInitialState()
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, dispatch];
};
