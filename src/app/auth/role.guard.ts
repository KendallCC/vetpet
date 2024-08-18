import { inject } from '@angular/core';
import { CanActivateFn ,Router } from '@angular/router';
import { AuthService } from '../share/services/auth.service';


export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRoles = route.data['roles'] as Array<string>;
  const currentUser = authService.currentUserValue;

  if (currentUser && expectedRoles.includes(currentUser.rol)) {
    return true;
  }

  // Redirect to login page if not authenticated or authorized
  router.navigate(['pagenotfound']);
  return false;
};
