import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
} from '@angular/fire/auth';
import { AuthCredential, EmailAuthProvider, User } from '@firebase/auth';
import {
  AuthFBService,
  AuthService,
} from '@course-platform/shared/auth/domain';

// interface for service

@Injectable({
  providedIn: 'root',
})
export class ProfileFBService {
  private currentUser!: User;
  constructor(private userService: AuthFBService) {
    this.userService.getFBUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  getUserProfile(): Observable<User> {
    return this.userService.getFBUser();
    // this.userProfile = this.firestore.doc(`userProfile/${user.uid}`);
    // return this.userProfile.valueChanges();
  }

  updateName(fullName: string) {
    return this.userService.getFBUser().subscribe((user) => {
      updateProfile(user, { displayName: fullName });
    });
  }

  async updateEmail(newEmail: string, password: string): Promise<void> {
    const credential: AuthCredential = EmailAuthProvider.credential(
      this.currentUser.email!,
      password
    );
    try {
      await reauthenticateWithCredential(this.currentUser, credential);
      await updateEmail(this.currentUser, newEmail);
      // return this.userProfile.update({ email: newEmail });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
    const credential: AuthCredential = EmailAuthProvider.credential(
      this.currentUser.email!,
      oldPassword
    );
    await reauthenticateWithCredential(this.currentUser, credential);
    return updatePassword(this.currentUser, newPassword);
  }
}
