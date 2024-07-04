import { Injectable } from '@angular/core';
import {
  AbstractUser,
  AuthSBService,
} from '@course-platform/shared/auth/domain';
import { injectTRPCClient } from '@course-platform/shared/domain/trpc-client';
import { Profile, ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileSBService implements ProfileService {
  private currentUser!: AbstractUser;
  private trpcClient = injectTRPCClient();
  constructor(private authService: AuthSBService) {
    this.authService.getUser().then((user) => {
      this.currentUser = user!;
    });
  }

  getUserProfile() {
    return this.trpcClient.user.getProfile.query();
  }

  updateName(fullName: string) {
    return this.trpcClient.user.updateProfile.mutate({ fullName });
  }

  async updateEmail(newEmail: string, password: string): Promise<void> {
    // const credential: AuthCredential = EmailAuthProvider.credential(
    //   this.currentUser.email!,
    //   password
    // );
    // try {
    //   await reauthenticateWithCredential(this.currentUser, credential);
    //   await updateEmail(this.currentUser, newEmail);
    //   // return this.userProfile.update({ email: newEmail });
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<void> {}
}
