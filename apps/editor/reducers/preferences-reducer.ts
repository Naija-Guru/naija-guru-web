import { ActionDispatch, useEffect, useReducer } from 'react';

import {
  getSavedPreferencesState,
  setSavedPreferencesState,
  TPreferencesState,
} from '@/lib/storage';
import { TSuggestionRule, TSuggestionRuleCategory } from '@/models/suggestion';

const createInitialState = () => getSavedPreferencesState();

export type TPreferencesReducerAction =
  | { type: 'SET_CUSTOM_API_DOMAIN'; payload: { url: string } }
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
  state: TPreferencesState,
  action: TPreferencesReducerAction
): TPreferencesState {
  switch (action.type) {
    case 'SET_CUSTOM_API_DOMAIN':
      return { ...state, customSpellCheckApiEndpoint: action.payload.url };
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

export const usePreferencesReducer = (): [
  TPreferencesState,
  ActionDispatch<[action: TPreferencesReducerAction]>,
] => {
  const [state, dispatch] = useReducer(
    preferencesReducer,
    createInitialState()
  );

  useEffect(() => {
    setSavedPreferencesState(state);
  }, [state]);

  return [state, dispatch];
};
