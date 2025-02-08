import { ActionDispatch, useEffect, useReducer } from 'react';

import {
  getSavedPreferencesState,
  setSavedPreferencesState,
  TPreferencesState,
} from '@/lib/storage';

const createInitialState = () => getSavedPreferencesState();

export type TPreferencesReducerAction =
  | { type: 'SET_CUSTOM_SPELL_CHECKER_API_ENDPOINT'; payload: { url: string } }
  | { type: 'RESET_CUSTOM_SPELL_CHECKER_API_ENDPOINT' }
  | {
      type: 'ADD_IGNORED_CATEGORY';
      payload: { categoryId: string };
    }
  | { type: 'REMOVE_IGNORED_CATEGORY'; payload: { categoryId: string } }
  | { type: 'CLEAR_IGNORED_CATEGORIES' }
  | { type: 'ADD_IGNORED_RULE'; payload: { ruleId: string } }
  | { type: 'REMOVE_IGNORED_RULE'; payload: { ruleId: string } }
  | { type: 'CLEAR_IGNORED_RULES' };

export function preferencesReducer(
  state: TPreferencesState,
  action: TPreferencesReducerAction
): TPreferencesState {
  switch (action.type) {
    case 'SET_CUSTOM_SPELL_CHECKER_API_ENDPOINT':
      return { ...state, customSpellCheckApiEndpoint: action.payload.url };
    case 'RESET_CUSTOM_SPELL_CHECKER_API_ENDPOINT':
      return { ...state, customSpellCheckApiEndpoint: null };
    case 'ADD_IGNORED_CATEGORY':
      return {
        ...state,
        ignoredCategories: [
          ...state.ignoredCategories,
          action.payload.categoryId,
        ],
      };
    case 'REMOVE_IGNORED_CATEGORY':
      return {
        ...state,
        ignoredCategories: state.ignoredCategories.filter(
          (categoryId) => categoryId === action.payload.categoryId
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
        ignoredRules: [...state.ignoredRules, action.payload.ruleId],
      };
    case 'REMOVE_IGNORED_RULE':
      return {
        ...state,
        ignoredRules: state.ignoredRules.filter(
          (ruleId) => ruleId === action.payload.ruleId
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
