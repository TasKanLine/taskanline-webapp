import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthActions } from '@core/auth/store/auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast.service';

// Интерфейс для типизации ошибок FastAPI
interface FastAPIError {
  detail?: string;
}

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) => {
            const errData = error.error || error;
            return of(AuthActions.loginFailure({ error: errData }));
          }),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.toastService.show('Login successful!', 'success');
          this.router.navigate(['/reference']);
        }),
      ),
    { dispatch: false },
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          const fastApiError = error as FastAPIError; // Приведение типа
          if (fastApiError.detail && typeof fastApiError.detail === 'string') {
            this.toastService.show(fastApiError.detail, 'error');
          } else if (!fastApiError.detail) {
            this.toastService.show('Login failed. Please check your credentials.', 'error');
          }
        }),
      ),
    { dispatch: false },
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ request }) =>
        this.authService.signup(request).pipe(
          map((response) => AuthActions.signupSuccess({ response })),
          catchError((error) => {
            const errData = error.error || error;
            return of(AuthActions.signupFailure({ error: errData }));
          }),
        ),
      ),
    ),
  );

  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap(({ response }) => {
          // Используем response.status из Python для сообщения
          this.toastService.show(response.status || 'Registration successful! Please login.', 'success');
          // Редирект на логин, так как куки нет
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );

  signupFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupFailure),
        tap(({ error }) => {
          const fastApiError = error as FastAPIError;
          if (fastApiError.detail && typeof fastApiError.detail === 'string') {
            this.toastService.show(fastApiError.detail, 'error');
          }
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        ),
      ),
    ),
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
          this.toastService.show('Logged out successfully', 'info');
        }),
      ),
    { dispatch: false },
  );

  checkAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuth),
      switchMap(() =>
        this.authService.checkAuth().pipe(
          map((user) => AuthActions.checkAuthSuccess({ user })),
          catchError(() => of(AuthActions.checkAuthFailure())),
        ),
      ),
    ),
  );
}
