import React, { createContext, useContext, useReducer } from 'react';
export enum ACTIONS {
  login,
  logout,
  signUp,
}

export interface IState {
  isLoggedIn: boolean;
  userData: any;
}

type TAction = { type: ACTIONS.login } | { type: 'increment' };

export type TDispatch = React.Dispatch<TAction>;

const initialState: IState = {
  isLoggedIn: false,
  userData: {},
};

const ProfileStateContext = createContext(initialState);
const ProfileDispatchContext = createContext<TDispatch>(() => ({}));

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case ACTIONS.login: {
      return {
        ...state,
        isLoggedIn: true,
      };
    }
    default: {
      return state;
    }
  }
};

const ProfileProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProfileDispatchContext.Provider value={dispatch}>
      <ProfileStateContext.Provider value={state}>{children}</ProfileStateContext.Provider>
    </ProfileDispatchContext.Provider>
  );
};

const useProfileState = (): IState => {
  const context = useContext(ProfileStateContext);
  if (typeof context === 'undefined') {
    throw new Error('useProfileState must be used within a ProfileProvider');
  }
  return context;
};

const useProfileDispatch = (): TDispatch => {
  const context = useContext(ProfileDispatchContext);
  if (typeof context === 'undefined') {
    throw new Error('useProfileDispatch must be used within a ProfileProvider');
  }
  return context;
};

const useProfileContext = (): [IState, TDispatch] => [useProfileState(), useProfileDispatch()];

export { ProfileProvider, useProfileContext };
