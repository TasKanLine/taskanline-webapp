import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, take } from 'rxjs';
import { selectIsAuthenticated, selectIsLoading } from '@core/auth/store/auth.reducer';

export const authGuard: CanActivateChildFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([store.select(selectIsAuthenticated), store.select(selectIsLoading)]).pipe(
    filter(([_, isLoading]) => !isLoading),
    take(1),
    map(([isAuthenticated, _]) => {
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/login']);
    }),
  );
};
