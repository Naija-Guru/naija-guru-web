'use client';

import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import {
  getSavedPreferencesState,
  preferencesReducerInitialState,
  setSavedPreferencesState,
  TPreferencesState,
} from '@/lib/storage';
import {
  preferencesReducer,
  TPreferencesReducerAction,
} from '@/reducers/preferences-reducer';
import { isClient } from '@/lib/utils';

type TPreferencesContext =
  | {
      state: TPreferencesState;
      dispatch: Dispatch<TPreferencesReducerAction>;
    }
  | undefined;

export const PreferencesContext = createContext<TPreferencesContext>(undefined);

export const PreferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    preferencesReducer,
    isClient() ? getSavedPreferencesState() : preferencesReducerInitialState
  );

  useEffect(() => {
    setSavedPreferencesState(state);
  }, [state]);

  return (
    <PreferencesContext.Provider value={{ state, dispatch }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }

  return context;
};
