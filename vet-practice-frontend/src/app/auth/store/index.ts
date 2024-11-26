import { createFeature, createSelector } from '@ngrx/store';
import { authReducer } from './auth.reducer';

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const {
  name,
  reducer,
  selectAuthState,
  selectUser,
  selectAccessToken,
  selectLoading,
  selectError,
} = authFeature;
