import { Injectable, NgZone } from '@angular/core';
import { Auth, User, updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
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
  ) {}

  getCurrentUser(): Observable<User> {
    return new Observable((observer) => {
      this.afAuth.onAuthStateChanged((currentUser) => {
        this.currentUser$.next(currentUser);
        // cb needs to run through zone to work in guard
        this.ngZone.run(() => {
          observer.next(currentUser);
        });
      });
    });
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.currentUser;
        updateProfile(user,{
          displayName: value.name,
          photoURL: user.photoURL,
        })
        .then(
          (res) => {
            resolve(res);
          },
          (err) => reject(err)
        );
    });
  }
}
