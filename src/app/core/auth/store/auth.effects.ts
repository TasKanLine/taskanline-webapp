import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthActions } from '@core/auth/store/auth.actions';
import { catchError, map, switchMap, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast.service';

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

  // Эффект для ПЕРВИЧНОГО входа (когда юзер нажал кнопку)
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ user }) => {
        // 1. Отправляем сигнал другим вкладкам (ТОЛЬКО ЗДЕСЬ)
        this.authService.broadcastLogin(user);
        // 2. Показываем тост
        this.toastService.show('Login successful!', 'success');
        // 3. Редирект
        this.router.navigate(['/profile']);
      }),
      // 4. Подтягиваем полные данные
      map(() => AuthActions.checkAuth()),
    ),
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          const fastApiError = error as FastAPIError;
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
          tap(() => this.authService.broadcastLogout()),
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        ),
      ),
    ),
  );

  // Синхронизация между вкладками
  syncAuth$ = createEffect(() =>
    this.authService.authMessage$.pipe(
      map((message) => {
        if (message.type === 'login' && message.payload) {
          // ВАЖНО: Диспатчим LoginSync, а не LoginSuccess!
          // Это предотвращает повторный вызов loginSuccess$ и создание цикла.
          return AuthActions.loginSync({ user: message.payload });
        } else if (message.type === 'logout') {
          return AuthActions.logoutSuccess();
        }
        return { type: 'NO_ACTION' };
      }),
      filter((action) => action.type !== 'NO_ACTION'),
    ),
  );

  // Эффект для СИНХРОНИЗИРОВАННОГО входа
  loginSync$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSync),
      tap(() => {
        // Просто редирект, БЕЗ Broadcast и БЕЗ Toast (чтобы не спамить)
        this.router.navigate(['/profile']);
      }),
      // Можно также вызвать checkAuth, если нужно обновить данные
      map(() => AuthActions.checkAuth()),
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
