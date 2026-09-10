import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const studentId = sessionStorage.getItem('loggedInStudentId');

  if (studentId) {
    return true;
  }

  return router.createUrlTree(['/login']);
};