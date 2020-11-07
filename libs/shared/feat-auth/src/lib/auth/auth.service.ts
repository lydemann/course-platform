import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}
  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            resolve(res);
          },
          err => reject(err)
        );
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.signOut();
        location.href = '/';
        resolve();
      } else {
        reject();
      }
    });
  }
}
