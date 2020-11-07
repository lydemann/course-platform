import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserService } from '@course-platform/shared/feat-auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentUser: firebase.User;
  constructor(private userService: UserService) {
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserProfile(): Observable<firebase.User> {
    return this.userService.getCurrentUser();
    // this.userProfile = this.firestore.doc(`userProfile/${user.uid}`);
    // return this.userProfile.valueChanges();
  }

  updateName(fullName: string) {
    return this.userService
      .getCurrentUser()
      .pipe(
        tap(user => {
          user.updateProfile({ displayName: fullName });
        })
      )
      .subscribe();
  }

  async updateEmail(newEmail: string, password: string): Promise<void> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      await this.currentUser.updateEmail(newEmail);
      // return this.userProfile.update({ email: newEmail });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );
    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      return this.currentUser.updatePassword(newPassword);
    } catch (error) {
      console.error(error);
    }
  }
}
