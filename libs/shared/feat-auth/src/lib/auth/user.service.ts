import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public ngZone: NgZone
  ) {}

  getCurrentUser(): Observable<firebase.User> {
    return new Observable(observer => {
      firebase.auth().onAuthStateChanged(currentUser => {
        // cb needs to run through zone to work in guard
        this.ngZone.run(() => {
          if (currentUser) {
            observer.next(currentUser);
          } else {
            observer.error('No user logged in');
          }
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
