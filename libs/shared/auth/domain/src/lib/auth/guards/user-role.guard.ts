import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSBService } from '../services/auth-sb.service';

export const userRoleGuard =
  (requiredRole: string): CanActivateFn =>
  async () => {
    const authService = inject(AuthSBService);
    const router = inject(Router);

    try {
      const userClaims = await authService.authClient.getClaims();
      console.log('userClaims', userClaims);
      if (
        userClaims &&
        userClaims.data?.claims['user_metadata']?.['user_role'] === requiredRole
      ) {
        return true;
      } else {
        console.log(
          'User does not have the required role, redirecting to login.'
        );
        router.navigate(['login']);
        return false;
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      router.navigate(['login']);
      return false;
    }
  };
