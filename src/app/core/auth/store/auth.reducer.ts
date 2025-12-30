import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from '@core/auth/store/auth.actions';
import { User } from '@core/auth/models/user.model';
import { HTTPValidationError } from '@core/auth/models/auth-dto.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: HTTPValidationError | HttpErrorResponse | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    // Login
    on(AuthActions.login, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.loginSuccess, (state, { user }) => ({
      ...state,
      isLoading: false,
      user,
      isAuthenticated: true,
      error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
      isAuthenticated: false,
    })),

    // Signup
    on(AuthActions.signup, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    // ИСПРАВЛЕНО: Регистрация не делает пользователя авторизованным
    on(AuthActions.signupSuccess, (state) => ({
      ...state,
      isLoading: false,
      error: null,
      // User и isAuthenticated остаются null/false, пока пользователь не залогинится
    })),
    on(AuthActions.signupFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // Logout
    on(AuthActions.logout, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(AuthActions.logoutSuccess, (state) => ({
      ...state,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })),

    // Check Auth
    on(AuthActions.checkAuth, (state) => ({
      ...state,
      isLoading: true, // Можно false, если не хотим показывать спиннер при тихой проверке
    })),
    on(AuthActions.checkAuthSuccess, (state, { user }) => ({
      ...state,
      user,
      isAuthenticated: true,
      isLoading: false,
    })),
    on(AuthActions.checkAuthFailure, (state) => ({
      ...state,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })),
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectAuthState,
  selectUser,
  selectIsAuthenticated,
  selectError,
  selectIsLoading,
} = authFeature;
