import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { AuthActions } from '@core/auth/store/auth.actions';
import { ToastService } from '@core/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - Logout and redirect
        // Only dispatch logout if we are not already on login page or trying to login?
        // Actually, if we get 401 during checkAuth or normal usage, we should logout.
        // If we get 401 during Login attempt, the Effect handles it via LoginFailure.
        // But for global protection:
        if (!req.url.includes('/login')) {
          store.dispatch(AuthActions.logout());
        }
      } else if (error.status >= 500 || error.status === 0) {
        toastService.show('Network or Server Error. Please try again later.', 'error');
      }

      return throwError(() => error);
    }),
  );
};
