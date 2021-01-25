import React, {createContext, useReducer} from 'react';

export const AppContext = createContext(null);

const {Provider} = AppContext;

const AppProvider = ({children}) => {
  // Global state
  const [state, setState] = useReducer(
    (oldState, newState) => ({...oldState, ...newState}),
    {
      menuVisible: true,
    },
  );

  return <Provider value={[state, setState]}>{children}</Provider>;
};

AppProvider.context = AppContext;

export default AppProvider;
