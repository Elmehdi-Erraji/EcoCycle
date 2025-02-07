import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.refreshUserData, (state) => {
    const userData = localStorage.getItem('currentUser');
    return {
      ...state,
      user: userData ? JSON.parse(userData) : null
    };
  }),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error
  })),
  on(AuthActions.logout, () => initialState)
);
