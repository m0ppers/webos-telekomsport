import { RouterState } from 'react-router-redux';

export interface RootState {
  router: RouterState;
  auth: RootState.Auth;
}

export namespace RootState {
  export interface Auth {
    error?: string;
    loggingIn: boolean;
    name?: string;
    jwt?: string;
    refreshToken?: string;
    authenticated: boolean;
  }
}
