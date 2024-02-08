import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@angular/fire/auth';
import { ProfileService } from '@course-platform/course-client/shared/domain';
import { AuthService } from '@course-platform/shared/auth/domain';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user$: Observable<User> = this.profileService.getUserProfile();
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
  errorMessage: string = '';
  constructor(
    private profileService: ProfileService,
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
    this.authService.doLogout();
  }
}
