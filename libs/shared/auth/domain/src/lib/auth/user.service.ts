import { isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { Auth, User, updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserServerService } from './user-server.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser$ = new BehaviorSubject<User>(null);
  isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));
  private platformId = inject(PLATFORM_ID);

  constructor(
    public db: Firestore,
    public afAuth: Auth,
    public ngZone: NgZone,
    cookieService: CookieService,
    userServerService: UserServerService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));
    } else {
      this.isLoggedIn$ = from(userServerService.isLoggedIn());
    }

    this.afAuth.onAuthStateChanged(async (currentUser) => {
      if (isPlatformBrowser(this.platformId)) {
        const token = await currentUser.getIdToken();
        cookieService.set('token', token);
      }
      this.ngZone.run(() => {
        this.currentUser$.next(currentUser);
      });
    });
  }

  updateCurrentUser(value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Promise<any>((resolve, reject) => {
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
