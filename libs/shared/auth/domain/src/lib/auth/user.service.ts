/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { Auth, User, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserServerService } from './user-server.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUser.pipe(
    filter((user) => !!user)
  ) as Observable<User>;
  uid$ = this.currentUser$.pipe(map((user) => user?.uid));
  isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));
  private platformId = inject(PLATFORM_ID);

  constructor(
    public afAuth: Auth,
    public ngZone: NgZone,
    userServerService: UserServerService
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
        this.currentUser.next(currentUser);
      });
    }
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      this.afAuth.onAuthStateChanged((currentUser) => {
        // cb needs to run through zone to work in guard
        this.ngZone.run(() => {
          observer.next(currentUser);
          observer.complete();
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
