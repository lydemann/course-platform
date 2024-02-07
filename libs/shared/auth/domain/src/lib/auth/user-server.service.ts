import { Injectable, signal } from '@angular/core';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
  providedIn: 'root',
})
export class UserServerService {
  idToken = signal<DecodedIdToken | null>(null);

  constructor(private cookieService: SsrCookieService) {}

  async getUserInfo(): Promise<DecodedIdToken | null> {
    const token = this.cookieService.get('token');
    if (!token) return Promise.resolve(null);

    const admin = await import('firebase-admin');
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      this.idToken.set(decodedToken);
      return decodedToken;
    } catch (error) {
      return Promise.resolve(null);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    return !!(await this.getUserInfo());
  }
}
