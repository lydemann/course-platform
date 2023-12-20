/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afAuth: Auth) {}
  doRegister(value) {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(
        this.afAuth,
        value.email,
        value.password
      ).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      signInWithEmailAndPassword(this.afAuth, value.email, value.password).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.afAuth, email);
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut();
        localStorage.clear();
        location.href = '/';
        resolve(true);
      } else {
        reject();
      }
    });
  }
}
