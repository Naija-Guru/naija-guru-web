import { VirtualElement } from '@floating-ui/dom';

import { TSuggestion } from '@/models/suggestion';
import { useReducer } from 'react';

export const suggestionsReducerInitialState = {
  loadingSuggestions: false,
  suggestionsList: {} as Record<string, TSuggestion[]>,
  selectedSuggestion: null as {
    elementId: string;
    suggestion: TSuggestion;
  } | null,
  isPopoverOpen: false,
  isAcceptingAllSuggestions: false,
  anchorRef: null as VirtualElement | null,
  editorContent: '',
};

export type SuggestionsReducerState = typeof suggestionsReducerInitialState;

export type SuggestionsReducerAction =
  | { type: 'SET_LOADING_SUGGESTIONS'; payload: boolean }
  | { type: 'SET_SUGGESTIONS_LIST'; payload: Record<string, TSuggestion[]> }
  | {
      type: 'SET_SELECTED_SUGGESTION';
      payload: { elementId: string; suggestion: TSuggestion } | null;
    }
  | { type: 'SET_IS_POPOVER_OPEN'; payload: boolean }
  | { type: 'SET_IS_FIXING_ALL'; payload: boolean }
  | { type: 'SET_ANCHOR_REF'; payload: VirtualElement | null }
  | { type: 'SET_EDITOR_CONTENT'; payload: string };

export function suggestionsReducer(
  state: SuggestionsReducerState,
  action: SuggestionsReducerAction
): SuggestionsReducerState {
  switch (action.type) {
    case 'SET_LOADING_SUGGESTIONS':
      return { ...state, loadingSuggestions: action.payload };
    case 'SET_SUGGESTIONS_LIST':
      return { ...state, suggestionsList: action.payload };
    case 'SET_SELECTED_SUGGESTION':
      return { ...state, selectedSuggestion: action.payload };
    case 'SET_IS_POPOVER_OPEN':
      return { ...state, isPopoverOpen: action.payload };
    case 'SET_IS_FIXING_ALL':
      return { ...state, isAcceptingAllSuggestions: action.payload };
    case 'SET_ANCHOR_REF':
      return { ...state, anchorRef: action.payload };
    case 'SET_EDITOR_CONTENT':
      return { ...state, editorContent: action.payload };
    default:
      return state;
  }
}

export const useSuggestionsReducer = () => {
  return useReducer(suggestionsReducer, suggestionsReducerInitialState);
};
