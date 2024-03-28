import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Keys } from '../models/keys'
import { Settings } from '../pages/settings/Settings';

// Define the shape of your state
interface AppState {
  keys: Keys | undefined;
  settings: Settings | undefined;
}

// Define the shape of your context
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
}

// Initial state
const initialState: AppState = {
  keys: undefined,
  settings: undefined
};

// Create context
const AppStateContext = createContext<AppContextProps | undefined>(undefined);

// Actions
const IMPORT = 'IMPORT';
const LOAD_SETTINGS = 'LOAD_SETTINGS'

// Action creators
interface ImportAction {
  type: typeof IMPORT;
  keys: Keys
}

interface SaveSettingsAction {
  type: typeof LOAD_SETTINGS;
  settings: Settings
}

type AppActions = ImportAction | SaveSettingsAction;

// Reducer
const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case IMPORT:
      return { ...state, keys: action.keys };
    case LOAD_SETTINGS:
      return { ...state, settings: action.settings };
    default:
      return state;
  }
};

// Provider Component
export const AppStateProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to use the AppStateContext
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
