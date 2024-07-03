import { Observable } from 'rxjs';

export interface UpdateUserInput {
  name: string;
}

export interface User {
  id: string;
}

// abstract
export abstract class AuthService {
  abstract sendPasswordResetEmail(value: any): Promise<unknown>;
  abstract handleClientAuthStateChanges<TSession = unknown>(
    cb: (event: string, session: TSession) => void
  ): void;

  abstract signUp(email: string, password: string): Promise<unknown>;

  abstract signIn(email: string, password: string): Promise<unknown>;

  abstract isLoggedIn(): Observable<boolean>;

  abstract signOut(): Promise<unknown>;

  abstract getUser<T>(): Promise<unknown>;

  abstract updateUser(userInfo: UpdateUserInput): Promise<unknown>;

  abstract updateCurrentUser(value: { name: string }): Promise<unknown>;

  abstract getSession<T>(): Promise<unknown>;

  abstract setSession<T>(): Promise<unknown>;

  abstract authenticateUserSSR<T>(): Promise<unknown>;
}
