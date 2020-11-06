import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { UserService } from '@course-platform/shared/feat-auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private currentUser: firebase.User;
  constructor(private userService: UserService) {}

  async getUserProfile(): Promise<any> {
    const user: firebase.User = await this.userService
      .getCurrentUser()
      .toPromise();
    return (this.currentUser = user);
    // this.userProfile = this.firestore.doc(`userProfile/${user.uid}`);
    // return this.userProfile.valueChanges();
  }

  updateName(fullName: string): Promise<void> {
    return this.currentUser.updateProfile({ displayName: fullName });
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
