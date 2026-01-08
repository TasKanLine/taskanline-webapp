import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SignupResponse, HTTPValidationError, LoginRequest, SignupRequest } from '@core/auth/models/auth-dto.model';
import { User } from '@core/auth/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ request: LoginRequest }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: HTTPValidationError | HttpErrorResponse }>(),
    'Login Sync': props<{ user: User }>(),

    Signup: props<{ request: SignupRequest }>(),
    // ИСПРАВЛЕНО: response теперь типа SignupResponse
    'Signup Success': props<{ response: SignupResponse }>(),
    'Signup Failure': props<{ error: HTTPValidationError | HttpErrorResponse }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),

    'Check Auth': emptyProps(),
    'Check Auth Success': props<{ user: User }>(),
    'Check Auth Failure': emptyProps(),
  },
});
