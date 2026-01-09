import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { AuthActions } from '@core/auth/store/auth.actions';
import { ToastService } from '@core/services/toast.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Игнорируем 401, если это запрос на проверку авторизации (/me)
      // или если это сам запрос логина (там ошибка обрабатывается в компоненте)
      const isCheckAuthRequest = req.url.includes('/me');
      const isLoginRequest = req.url.includes('/login');

      if (error.status === 401 && !isCheckAuthRequest && !isLoginRequest) {
        // Если 401 пришел от любого ДРУГОГО запроса (например, getProjects),
        // значит, токен протух во время работы -> делаем Logout
        store.dispatch(AuthActions.logout());
      } else if (error.status === 403) {
        // Если 403 пришел от любого запроса, значит, нет доступа
        router.navigate(['error/403']);
        toastService.show('Access Denied', 'error');
      } else if (error.status >= 500 || error.status === 0) {
        // Ошибки сервера показываем всегда
        router.navigate(['error/500']);
        toastService.show('Network or Server Error. Please try again later.', 'error');
      }

      // Пробрасываем ошибку дальше, чтобы Effect или Компонент могли её обработать
      // (например, чтобы checkAuthEffect мог поставить isAuthenticated: false)
      return throwError(() => error);
    }),
  );
};
