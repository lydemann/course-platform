/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { AbstractUser, AuthService, UpdateUserInput } from './auth.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { BehaviorSubject, Observable, filter, firstValueFrom, map } from 'rxjs';

export interface UserCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthFBService extends AuthService {
  private ngZone = inject(NgZone);
  private cookieService = inject(SsrCookieService);
  currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.pipe(
    filter((user) => !!user)
  ) as Observable<User>;
  uid$ = this.currentUser$.pipe(map((user) => user?.uid));
  isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));

  private readonly SESSION_COOKIE_KEY = '__session';

  constructor(public afAuth: Auth) {
    super();
  }

  override isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  override handleClientAuthStateChanges(
    cb: (event: string, session: any) => void
  ): void {
    this.afAuth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) return;
      const token = (await currentUser?.getIdToken()) || '';
      this.cookieService.set(this.SESSION_COOKIE_KEY, token);
      cb('SIGNED_IN', currentUser);
    });
  }

  override signUp(email: string, password: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.afAuth, email!, password).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  override signIn(email: string, password: string): Promise<unknown> {
    return new Promise<any>((resolve, reject) => {
      signInWithEmailAndPassword(this.afAuth, email, password).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  override signOut(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut();
        localStorage.clear();
        location.href = '/';
        resolve(true);
      } else {
        reject();
      }
    });
  }

  override async getUser() {
    const fbUser = await firstValueFrom(this.getFBUser());

    if (!fbUser) return null;

    return {
      id: fbUser.uid,
      email: fbUser.email,
    } as AbstractUser;
  }

  getFBUser(): Observable<User | null> {
    return new Observable((observer) => {
      this.afAuth.onAuthStateChanged((currentUser) => {
        // cb needs to run through zone to work in guard
        this.ngZone.run(() => {
          observer.next(currentUser!);
          this.currentUser.next(currentUser);
          observer.complete();
        });
      });
    });
  }

  override updateCurrentUser(value: { name: string }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<any>((resolve, reject) => {
      if (!this.afAuth.currentUser) return reject('No user');
      const user = this.afAuth.currentUser;
      updateProfile(user, {
        displayName: value.name,
        photoURL: user.photoURL,
      }).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  override getSession<T>(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  override setSession<T>(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async authenticateUserSSR<T>(): Promise<unknown> {
    return this.authenticateUserFBSSR();
  }

  async authenticateUserFBSSR<T>() {
    const token = this.cookieService.get(this.SESSION_COOKIE_KEY);

    if (!token) {
      return Promise.resolve(null);
    }

    try {
      const { auth } = (await import('firebase-admin')).default;
      const decodedToken = await auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      // console.error('Error while verifying token', error);
      this.cookieService.delete(this.SESSION_COOKIE_KEY);
      return Promise.resolve(null);
    }
  }

  override updateUser(userInput: UpdateUserInput): Promise<unknown> {
    return new Promise<any>((resolve, reject) => {
      if (!this.afAuth.currentUser) return reject('No user');
      const user = this.afAuth.currentUser;
      updateProfile(user, {
        displayName: userInput.name,
      }).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.afAuth, email);
  }
}
