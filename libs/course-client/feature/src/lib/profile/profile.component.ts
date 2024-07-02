import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@angular/fire/auth';
import {
  AuthFBService,
  AuthService,
} from '@course-platform/shared/auth/domain';
import { ProfileFBService } from '@course-platform/course-client/shared/domain';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user$: Observable<User> = from(this.profileService.getUserProfile());
  profileForm$: Observable<FormGroup> = this.user$.pipe(
    map((user) =>
      this.formBuilder.group({
        fullName: [user.displayName, Validators.required],
        email: [user.email],
        uid: [user.uid],
      })
    )
  );
  changePwForm: FormGroup = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });
  errorMessage = '';
  constructor(
    private profileService: ProfileFBService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  onUpdateProfile(profileForm: FormGroup) {
    const fullName = profileForm.get('fullName')!.value;
    this.profileService.updateName(fullName);
  }

  async onChangePassword() {
    this.errorMessage = '';
    const currentPassword = this.changePwForm.get('currentPassword')!.value;
    const newPassword = this.changePwForm.get('newPassword')!.value;
    const confirmPassword = this.changePwForm.get('confirmPassword')!.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = `Passwords don't match.`;
      return;
    }

    try {
      await this.profileService.updatePassword(newPassword, currentPassword);
      this.changePwForm.reset();
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }
  }

  onLogout() {
    this.authService.signOut();
  }
}
