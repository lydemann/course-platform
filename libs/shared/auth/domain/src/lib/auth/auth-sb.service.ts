import { Injectable, inject } from '@angular/core';
import { GoTrueClient } from '@supabase/auth-js';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { authClient } from './auth-client';

const ACCESS_TOKEN_COOKIE_KEY = 'sb-access-token';
const REFRESH_TOKEN_COOKIE_KEY = 'sb-refresh-token';
const PROVIDER_TOKEN_COOKIE_KEY = 'sb-provider-token';
const PROVIDER_REFRESH_TOKEN_COOKIE_KEY = 'sb-provider-refresh-token';

@Injectable({ providedIn: 'root' })
export class AuthSBService {
  authClient: GoTrueClient;
  ssrCookieService = inject(SsrCookieService);
  constructor() {
    this.authClient = authClient;
  }

  // called from app.component.ts
  handleClientAuthStateChanges(cb: (event: string, session: any) => void) {
    this.authClient.onAuthStateChange((event, session) => {
      if (!session) return;

      // Use cookies to share session state between server and client
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        cb(event, session);
        this.ssrCookieService.set(
          ACCESS_TOKEN_COOKIE_KEY,
          session?.access_token
        );
        this.ssrCookieService.set(
          REFRESH_TOKEN_COOKIE_KEY,
          session?.refresh_token
        );
        if (session.provider_token) {
          this.ssrCookieService.set(
            PROVIDER_TOKEN_COOKIE_KEY,
            session.provider_token
          );
        }
        if (session.provider_refresh_token) {
          this.ssrCookieService.set(
            PROVIDER_REFRESH_TOKEN_COOKIE_KEY,
            session.provider_refresh_token
          );
        }
      }
      if (event === 'SIGNED_OUT') {
        this.ssrCookieService.delete(ACCESS_TOKEN_COOKIE_KEY);
        this.ssrCookieService.delete(REFRESH_TOKEN_COOKIE_KEY);
        this.ssrCookieService.delete(PROVIDER_TOKEN_COOKIE_KEY);
        this.ssrCookieService.delete(PROVIDER_REFRESH_TOKEN_COOKIE_KEY);
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

  /**
   * Get the user from the auth client using network request to auth server.
   * Should be used when checking for user authorization on the server.
   **/
  async getUser() {
    return await this.authClient.getUser();
  }

  /**
   * Get the local session from the auth client, refreshes if needed
   * To be used in browser only as it uses local storage
   * Can't be used for authentating the user in SSR as it uses the local storage which can be tampered with.
   * Instead use getUser() for authenticating the user in SSR
   **/
  async getSession() {
    return await this.authClient.getSession();
  }

  /**
   * Set the session in the auth client using the session data from the cookies.
   * Used in SSR to set the session based on the cookies.
   **/
  async setSession() {
    return await this.authClient.setSession({
      access_token: this.ssrCookieService.get(ACCESS_TOKEN_COOKIE_KEY),
      refresh_token: this.ssrCookieService.get(REFRESH_TOKEN_COOKIE_KEY),
    });
  }

  /**
   * Sets the session based on cookies and authenticates the user using request to the auth server.
   * @returns true if the user is authenticated, false otherwise.
   */
  async authenticateUserSSR() {
    await this.setSession();
    return await this.getUser();
  }
}
