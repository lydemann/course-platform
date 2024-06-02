import { Injectable, inject } from '@angular/core';
import { AuthClient, GoTrueClient } from '@supabase/auth-js';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

const AUTH_URL = `${import.meta.env['VITE_SUPABASE_URL']!}/auth/v1`;
const AUTH_HEADERS = {
  Authorization: `Bearer ${import.meta.env['VITE_SUPABASE_KEY']!}`,
  apikey: `${import.meta.env['VITE_SUPABASE_KEY']!}`,
};

export const authClient = new AuthClient({
  headers: AUTH_HEADERS,
  url: AUTH_URL,
  fetch: fetch,
});

@Injectable({ providedIn: 'root' })
export class AuthSBService {
  authClient: GoTrueClient;
  ssrCookieService = inject(SsrCookieService);
  constructor() {
    this.authClient = authClient;
  }

  handleClientAuthStateChanges(cb: (event: string, session: any) => void) {
    this.authClient.onAuthStateChange((event, session) => {
      if (!session) return;

      // Use cookies to share session state between server and client
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        cb(event, session);
        this.ssrCookieService.set('sb-access-token', session?.access_token);
        this.ssrCookieService.set('sb-refresh-token', session?.refresh_token);
        if (session.provider_token) {
          this.ssrCookieService.set(
            'sb-provider-token',
            session.provider_token
          );
        }
        if (session.provider_refresh_token) {
          this.ssrCookieService.set(
            'sb-provider-refresh-token',
            session.provider_refresh_token
          );
        }
        // this.router.navigate(['courses']);
      }
      if (event === 'SIGNED_OUT') {
        this.ssrCookieService.delete('sb-access-token');
        this.ssrCookieService.delete('sb-refresh-token');
        this.ssrCookieService.delete('sb-provider-token');
        this.ssrCookieService.delete('sb-provider-refresh-token');
      }
    });
  }

  async signUp(email: string, password: string) {
    return this.authClient.signUp({ email, password });
  }

  async signIn(email: string, password: string) {
    return this.authClient.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.authClient.signOut();
  }

  async getUser() {
    return await this.authClient.getUser();
  }

  async getSession() {
    return await this.authClient.getSession();
  }

  async setSession() {
    return await this.authClient.setSession({
      access_token: this.ssrCookieService.get('sb-access-token'),
      refresh_token: this.ssrCookieService.get('sb-refresh-token'),
    });
  }

  async authenticateUser() {
    await this.authClient.setSession({
      access_token: this.ssrCookieService.get('sb-access-token'),
      refresh_token: this.ssrCookieService.get('sb-refresh-token'),
    });
    return await this.authClient.getUser();
  }
}
