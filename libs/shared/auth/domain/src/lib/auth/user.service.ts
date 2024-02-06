import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Injectable,
  NgZone,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
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
  currentUser = signal<User>(null);
  uid$ = this.currentUser$.pipe(map((user) => user?.uid));
  uid = signal<string>('');
  isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));
  private platformId = inject(PLATFORM_ID);

  constructor(
    public db: Firestore,
    public afAuth: Auth,
    public ngZone: NgZone,
    private userServerService: UserServerService,
    cookieService: CookieService
  ) {
    if (isPlatformServer(this.platformId)) {
      this.isLoggedIn$ = from(userServerService.isLoggedIn());
      this.uid$ = from(userServerService.getUserInfo()).pipe(
        map((user) => user.uid)
      );
    } else {
      this.uid$ = this.currentUser$.pipe(map((user) => user?.uid));
    }

    this.afAuth.onAuthStateChanged(async (currentUser) => {
      if (isPlatformBrowser(this.platformId)) {
        const token = await currentUser.getIdToken();
        cookieService.set('token', token);
        this.ngZone.run(() => {
          this.currentUser.set(currentUser);
          this.currentUser$.next(currentUser);
        });
      }
    });

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
