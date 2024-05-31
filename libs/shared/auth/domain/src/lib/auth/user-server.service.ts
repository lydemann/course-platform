import { Injectable } from '@angular/core';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root',
})
export class UserServerService {
  constructor(private cookieService: SsrCookieService) {}

  private readonly SESSION_COOKIE_KEY = '__session';

  setIdToken(token: string) {
    this.cookieService.set(this.SESSION_COOKIE_KEY, token);
  }

  getIdToken() {
    return this.cookieService.get(this.SESSION_COOKIE_KEY);
  }

  async getUserInfo(): Promise<DecodedIdToken | null> {
    const token = this.getIdToken();

    if (!token) {
      return Promise.resolve(null);
    }

    try {
      const { auth } = (await import('firebase-admin')).default;
      const decodedToken = await auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      // console.error('Error while verifying token', error);
      return Promise.resolve(null);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return !!(await this.getUserInfo());
  }
}
