import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';
import { selectIsAuthenticated, selectIsLoading } from '../store/auth.reducer';
import { combineLatest } from 'rxjs';

export const guestGuard: CanActivateChildFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([store.select(selectIsAuthenticated), store.select(selectIsLoading)]).pipe(
    filter(([_, isLoading]) => !isLoading),
    take(1),
    map(([isAuthenticated, _]) => {
      if (isAuthenticated) {
        return router.createUrlTree(['/profile']);
      }
      return true;
    }),
  );
};
