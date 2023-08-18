import { Injectable } from '@angular/core';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from '@angular/fire/auth';
import { UserService } from '@course-platform/shared/feat-auth';
import { AuthCredential, EmailAuthProvider, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private currentUser: User;
  constructor(private userService: UserService) {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  getUserProfile(): Observable<User> {
    return this.userService.getCurrentUser();
    // this.userProfile = this.firestore.doc(`userProfile/${user.uid}`);
    // return this.userProfile.valueChanges();
  }

  updateName(fullName: string) {
    return this.userService
      .getCurrentUser()
      .pipe(
        tap((user) => {
          updateProfile(user, { displayName: fullName });
        })
      )
      .subscribe();
  }

  async updateEmail(newEmail: string, password: string): Promise<void> {
    const credential: AuthCredential =
      EmailAuthProvider.credential(
        this.currentUser.email,
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
    const credential: AuthCredential =
      EmailAuthProvider.credential(
        this.currentUser.email,
        oldPassword
      );
    await reauthenticateWithCredential(this.currentUser, credential);
    return updatePassword(this.currentUser, newPassword);
  }
}
