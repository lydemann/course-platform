import { Injectable, NgZone } from '@angular/core';
import { Auth, User, updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  currentUser$ = new BehaviorSubject<User>(null);
  isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));

  constructor(
    public db: Firestore,
    public afAuth: Auth,
    public ngZone: NgZone
  ) {
    this.afAuth.onAuthStateChanged((currentUser) => {
      // document.cookie = `token=${currentUser.getIdToken()};`;
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
