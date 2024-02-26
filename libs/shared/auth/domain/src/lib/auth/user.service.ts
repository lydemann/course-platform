/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Injectable,
  NgZone,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Auth, User, updateProfile } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserServerService } from './user-server.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser = signal<User | null>(null);
  currentUser$ = toObservable(this.currentUser).pipe(filter((user) => !!user));
  uid$ = this.currentUser$.pipe(map((user) => user?.uid));
  uid = signal<string>('');
  isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));
  private platformId = inject(PLATFORM_ID);

  constructor(
    public afAuth: Auth,
    public ngZone: NgZone,
    private userServerService: UserServerService
  ) {
    if (isPlatformServer(this.platformId)) {
      this.isLoggedIn$ = from(userServerService.isLoggedIn());
      this.uid$ = from(userServerService.getUserInfo()).pipe(
        filter((user) => !!user),
        map((user) => user!.uid)
      );
    }

    if (isPlatformBrowser(this.platformId)) {
      this.getCurrentUser().subscribe(async (currentUser) => {
        const token = (await currentUser?.getIdToken()) || '';
        userServerService.setIdToken(token);
        this.currentUser.set(currentUser);
      });
    }

    effect(
      async () => {
        if (isPlatformServer(this.platformId)) {
          const userInfo = await this.userServerService.getUserInfo();
          this.uid.set(userInfo?.uid || '');
        } else {
          return this.uid.set(this.currentUser()?.uid || '');
        }
      },
      { allowSignalWrites: true }
    );
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      this.afAuth.onAuthStateChanged((currentUser) => {
        // cb needs to run through zone to work in guard
        this.ngZone.run(() => {
          observer.next(currentUser);
        });
      });
    });
  }

  updateCurrentUser(value: { name: string }) {
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
}
