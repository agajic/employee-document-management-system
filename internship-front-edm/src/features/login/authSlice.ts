import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { LoginPayload, User } from './authModel';

export enum ActionStatus {
  Idle, Pending, Failed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginStatus: ActionStatus;
  logoutStatus: ActionStatus;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loginStatus: ActionStatus.Idle,
  logoutStatus: ActionStatus.Idle,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested: (state, action: PayloadAction<LoginPayload>) => {
      state.loginStatus = ActionStatus.Pending;
    },                    
    loginSucceeded: (state, action: PayloadAction<User>) => { 
      state.user = action.payload;                           //ex. PayloadAction<{ value : number }>   action.payload.value
      state.isAuthenticated = true;
      state.loginStatus = ActionStatus.Idle;
    },
    loginFailed: (state) => {
      state.loginStatus = ActionStatus.Failed;
    },
    logoutRequested: (state) => { 
      state.logoutStatus = ActionStatus.Pending;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.logoutStatus = ActionStatus.Idle;
    },
    checkAuthRequested: (state) => {
      state.loginStatus = ActionStatus.Pending;
    },
    checkAuthFailed: (state) => {
      state.loginStatus = ActionStatus.Idle;
      state.isAuthenticated = false;
    },
  },
});

export const selectIsLoginOngoing = (state: RootState) => state.auth.loginStatus === ActionStatus.Pending;
export const selectIsLoginFailed = (state: RootState) => state.auth.loginStatus === ActionStatus.Failed;
export const selectLoginActionStatus = (state: RootState) => state.auth.loginStatus;

export const { 
  loginRequested, loginSucceeded, loginFailed, 
  logoutRequested, logoutSuccess, 
  checkAuthRequested, checkAuthFailed } = authSlice.actions;
export default authSlice.reducer;