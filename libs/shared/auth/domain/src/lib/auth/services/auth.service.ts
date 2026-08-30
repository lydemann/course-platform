import { Observable } from 'rxjs';
import { AuthSessionMissingError } from '@supabase/auth-js';

export function isAuthSessionMissingError(
  error: unknown,
): error is AuthSessionMissingError {
  return error instanceof AuthSessionMissingError;
}

export interface UpdateUserInput {
  name: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AbstractUser {
  id: string;
  email: string | undefined;
}

// abstract
export abstract class AuthService {
  abstract updatePassword(password: string): Promise<unknown>;
  abstract uid(): Observable<string | null>;

  abstract sendPasswordResetEmail(value: any): Promise<unknown>;
  abstract handleClientAuthStateChanges<
    TSession extends { access_token: string },
  >(cb: (event: string, session: TSession) => void): void;

  abstract signUp(email: string, password: string): Promise<unknown>;

  abstract signIn(email: string, password: string): Promise<unknown>;

  abstract isLoggedIn(): Observable<boolean>;

  abstract signOut(): Promise<unknown>;

  abstract getUser(): Promise<AbstractUser | null>;

  abstract updateUser(userInfo: UpdateUserInput): Promise<unknown>;

  abstract updateCurrentUser(value: { name: string }): Promise<unknown>;

  abstract getSession<T>(): Promise<unknown>;

  abstract setSession<T>(): Promise<unknown>;

  abstract authenticateUserSSR<T>(): Promise<unknown>;
}
