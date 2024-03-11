import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the shape of your state
interface AppState {
  counter: number;
}

// Define the shape of your context
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<any>;
}

// Initial state
const initialState: AppState = {
  counter: 0,
};

// Create context
const AppStateContext = createContext<AppContextProps | undefined>(undefined);

// Actions
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// Action creators
interface IncrementAction {
  type: typeof INCREMENT;
}

interface DecrementAction {
  type: typeof DECREMENT;
}

type AppActions = IncrementAction | DecrementAction;

// Reducer
const appReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + 1 };
    case DECREMENT:
      return { ...state, counter: state.counter - 1 };
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
