import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser$ = new BehaviorSubject<firebase.User>(null);
  isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone
  ) {}

  getCurrentUser(): Observable<firebase.User> {
    return new Observable(observer => {
      firebase.auth().onAuthStateChanged(currentUser => {
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
      const user = firebase.auth().currentUser;
      user
        .updateProfile({
          displayName: value.name,
          photoURL: user.photoURL
        })
        .then(
          res => {
            resolve(res);
          },
          err => reject(err)
        );
    });
  }
}
