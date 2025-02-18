import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    const router = new Router();
    router.navigate(['/login']); // Redirect to login if token is missing
    return false;
  }

  return true; // Allow access if token exists
};
