/* eslint-disable @typescript-eslint/ban-types */
import { isPlatformServer } from '@angular/common';
import {
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { from, lastValueFrom } from 'rxjs';
import { UserServerService } from './user-server.service';

export const authServerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  platformId = inject(PLATFORM_ID),
  cookieService = inject(SsrCookieService),
  userServerService = inject(UserServerService)
) => {
  return from(
    handleAuthServerInterceptor(
      req,
      next,
      platformId,
      cookieService,
      userServerService
    )!
  )!;
};

async function handleAuthServerInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  location: Object,
  cookieService: SsrCookieService,
  userServerService: UserServerService
) {
  if (isPlatformServer(location)) {
    let headers = new HttpHeaders();

    const token = cookieService.get('token');
    headers = headers.set('Authorization', token);

    const userInfo = await userServerService.getUserInfo();
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
