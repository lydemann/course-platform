import { Injectable, inject } from '@angular/core';
import { GoTrueClient } from '@supabase/auth-js';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { injectTRPCClient } from '@course-platform/shared/domain/trpc-client';
import { AuthClient, User, UserAttributes } from '@supabase/supabase-js';
import { AbstractUser, AuthService, UpdateUserInput } from './auth.service';
import { BehaviorSubject, Observable, filter, firstValueFrom, map } from 'rxjs';

const env = import.meta.env || {};

const AUTH_URL = `${env['VITE_SUPABASE_URL']}/auth/v1`;
const AUTH_HEADERS = {
  Authorization: `Bearer ${env['VITE_SUPABASE_KEY']}`,
  apikey: `${env['VITE_SUPABASE_KEY']}`,
};

export const authClient = new AuthClient({
  headers: AUTH_HEADERS,
  url: AUTH_URL,
  fetch: fetch,
});

const ACCESS_TOKEN_COOKIE_KEY = 'sb-access-token';
const REFRESH_TOKEN_COOKIE_KEY = 'sb-refresh-token';
const PROVIDER_TOKEN_COOKIE_KEY = 'sb-provider-token';
const PROVIDER_REFRESH_TOKEN_COOKIE_KEY = 'sb-provider-refresh-token';

@Injectable({ providedIn: 'root' })
export class AuthSBService extends AuthService {
  randomServiceId = Math.random();
  currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.pipe(
    filter((user) => !!user)
  ) as Observable<User>;
  override uid() {
    return this.currentUser$.pipe(map((user) => user?.id));
  }
  isLoggedIn$ = this.currentUser.pipe(
    map((user) => {
      return !!user;
    })
  );

  override updateCurrentUser(value: { name: string }): Promise<unknown> {
    const updatedUser = { name: value.name } as UserAttributes;
    return this.authClient.updateUser(updatedUser);
  }
  authClient: GoTrueClient;
  ssrCookieService = inject(SsrCookieService);
  trpcClient = injectTRPCClient();
  constructor() {
    super();
    this.authClient = authClient;
  }

  override isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  // called from app.component.ts
  override handleClientAuthStateChanges(
    cb: (event: string, session: any) => void
  ) {
    this.authClient.onAuthStateChange((event, session) => {
      if (!session) return;

      // Use cookies to share session state between server and client
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        cb(event, session);
        this.currentUser.next(session.user);
        this.ssrCookieService.set(
          ACCESS_TOKEN_COOKIE_KEY,
          session?.access_token,
          undefined,
          '/'
        );
        this.ssrCookieService.set(
          REFRESH_TOKEN_COOKIE_KEY,
          session?.refresh_token,
          undefined,
          '/'
        );
        if (session.provider_token) {
          this.ssrCookieService.set(
            PROVIDER_TOKEN_COOKIE_KEY,
            session.provider_token,
            undefined,
            '/'
          );
        }
        if (session.provider_refresh_token) {
          this.ssrCookieService.set(
            PROVIDER_REFRESH_TOKEN_COOKIE_KEY,
            session.provider_refresh_token,
            undefined,
            '/'
          );
        }
      }
      if (event === 'SIGNED_OUT') {
        this.currentUser.next(null);
        this.ssrCookieService.delete(ACCESS_TOKEN_COOKIE_KEY);
        this.ssrCookieService.delete(REFRESH_TOKEN_COOKIE_KEY);
        this.ssrCookieService.delete(PROVIDER_TOKEN_COOKIE_KEY);
        this.ssrCookieService.delete(PROVIDER_REFRESH_TOKEN_COOKIE_KEY);
      }
    });
  }

  signUp(email: string, password: string) {
    return firstValueFrom(
      this.trpcClient.user.createUser.mutate({ email, password })
    );
  }

  async signIn(email: string, password: string) {
    return this.authClient.signInWithPassword({ email, password });
  }

  async signOut() {
    await this.authClient.signOut();
    localStorage.clear();
    location.href = '/';
  }

  /**
   * Get the user from the auth client using network request to auth server.
   * Should be used when checking for user authorization on the server.
   **/
  async getUser() {
    const userResponse = await this.authClient.getUser();
    if (userResponse.error) {
      throw userResponse.error;
    }

    if (!userResponse.data?.user) {
      return null;
    }

    this.currentUser.next(userResponse.data?.user);

    return {
      id: userResponse.data?.user.id,
      email: userResponse.data?.user.email,
    } as AbstractUser;
  }

  updateUser(userInfo: UpdateUserInput): Promise<unknown> {
    throw new Error('Method not implemented.');
    // update supabase user
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

  override updatePassowrd(password: string): Promise<unknown> {
    return this.authClient.updateUser({ password }).then((res) => {
      if (res.error) {
        throw res.error;
      }
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

  sendPasswordResetEmail(email: string) {
    return this.authClient.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }
}
