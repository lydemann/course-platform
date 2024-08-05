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

  async updateEmail(newEmail: string, password: string): Promise<unknown> {
    return await this.authService.authClient
      .updateUser({
        email: newEmail,
        password,
      })
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
      });
  }

  async updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<unknown> {
    return await this.authService.updatePassword(newPassword);
  }
}
