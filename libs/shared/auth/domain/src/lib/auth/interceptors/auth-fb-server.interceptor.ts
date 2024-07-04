/* eslint-disable @typescript-eslint/ban-types */
import { isPlatformServer } from '@angular/common';
import {
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { firstValueFrom, from, lastValueFrom } from 'rxjs';
import { AuthFBService } from '../services/auth-fb.service';

export const authFBServerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  platformId = inject(PLATFORM_ID),
  authFBService = inject(AuthFBService)
) => {
  return from(
    handleAuthServerInterceptor(req, next, platformId, authFBService)!
  )!;
};

async function handleAuthServerInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  location: Object,
  userServerService: AuthFBService
) {
  if (isPlatformServer(location)) {
    let headers = new HttpHeaders();

    const user = await firstValueFrom(userServerService.getFBUser());
    const token = await user?.getIdToken();
    headers = headers.set('Authorization', token || '');

    const userInfo = await userServerService.authenticateUserFBSSR();
    const tenantId = userInfo?.firebase?.tenant;
    if (tenantId) {
      headers = headers.set('Schoolid', tenantId);
    }

    const cookiedRequest = req.clone({
      headers,
    });

    return lastValueFrom(next(cookiedRequest));
  } else {
    return lastValueFrom(next(req));
  }
}
