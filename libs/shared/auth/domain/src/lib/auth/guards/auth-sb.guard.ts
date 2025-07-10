import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { AuthSBService } from '../services/auth-sb.service';

const LOGIN_URL = 'login';

export const authSBGuard =
  (redirectIfAuthenticatedUrl = '', requiredRole?: string): CanActivateFn =>
  async () => {
    const platformId = inject(PLATFORM_ID);
    const authService = inject(AuthSBService);
    const router = inject(Router);

    if (isPlatformBrowser(platformId)) {
      try {
        const session = !!(await authService.getSession());
        if (!session && !requiredRole) {
          return navigateToLogin();
        }
        if (requiredRole) {
          const userClaims = await authService.authClient.getClaims();
          if (
            userClaims &&
            userClaims.data?.claims['user_metadata']?.['user_role'] !==
              requiredRole
          ) {
            return navigateToLogin();
          }
        }
      } catch (error) {
        console.error('Error authenticating user on client:', error);
        return navigateToLogin();
      }
      navigateToRedirectUrl(router, redirectIfAuthenticatedUrl);
      return true;
    }

    try {
      const serverUser = await authService.authenticateUserSSR();
      if (!serverUser) {
        return navigateToLogin();
      }
      if (requiredRole) {
        const userClaims = await authService.authClient.getClaims();
        if (
          userClaims &&
          userClaims.data?.claims['user_metadata']?.['user_role'] !==
            requiredRole
        ) {
          return navigateToLogin();
        }
      }
    } catch (error) {
      console.error('Error authenticating user on server:', error);
      return navigateToLogin();
    }

    navigateToRedirectUrl(router, redirectIfAuthenticatedUrl);
    return true;

    function navigateToLogin() {
      console.log('Not authenticated, redirecting to login on server.');
      router.navigate([LOGIN_URL]);
      return false;
    }

    function navigateToRedirectUrl(
      router: Router,
      redirectIfAuthenticatedUrl: string
    ) {
      if (redirectIfAuthenticatedUrl) {
        console.log('Redirecting to', redirectIfAuthenticatedUrl);
        router.navigate([redirectIfAuthenticatedUrl]);
      }
    }
  };
