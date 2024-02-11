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
import { BehaviorSubject, Observable, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserServerService } from './user-server.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject
    .asObservable()
    .pipe(filter((user) => !!user)) as Observable<User>;
  currentUser = signal<User | null>(null);
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

    this.afAuth.onAuthStateChanged(async (currentUser) => {
      if (isPlatformBrowser(this.platformId) && currentUser) {
        const token = await currentUser.getIdToken();
        userServerService.setIdToken(token);
        this.ngZone.run(() => {
          this.currentUser.set(currentUser);
          this.currentUserSubject.next(currentUser);
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
