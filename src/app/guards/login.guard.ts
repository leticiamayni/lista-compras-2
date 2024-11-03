import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  return auth.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        auth.loginWithRedirect();
        return false;
      }
      return true;
    })
  );
};