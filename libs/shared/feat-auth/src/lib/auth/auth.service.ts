import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      createUserWithEmailAndPassword(
        getAuth(),
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
      signInWithEmailAndPassword(getAuth(), value.email, value.password).then(
        (res) => {
          resolve(res);
        },
        (err) => reject(err)
      );
    });
  }

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (getAuth().currentUser) {
        signOut(getAuth());
        localStorage.clear();
        location.href = '/';
        resolve(true);
      } else {
        reject();
      }
    });
  }
}
