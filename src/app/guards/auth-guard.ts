import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStatusService } from '../services/auth-status.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authStatusService = inject(AuthStatusService);
  const router = inject(Router);

  if (authStatusService.getIsAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
