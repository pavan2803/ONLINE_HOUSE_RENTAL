import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, UserRole } from './auth.service';

export function authGuard(requiredRoles: UserRole[] = []): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.getUser();
    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }
    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      router.navigate(['/auth/not-authorized']);
      return false;
    }
    return true;
  };
}
