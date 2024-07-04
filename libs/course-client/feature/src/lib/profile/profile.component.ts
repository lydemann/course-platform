import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '@course-platform/shared/auth/domain';
import {
  Profile,
  ProfileService,
} from '@course-platform/course-client/shared/domain';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@course-platform/course-client/shared/ui';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
})
export class ProfileComponent {
  user$: Observable<Profile> = from(this.profileService.getUserProfile());
  profileForm$: Observable<FormGroup> = this.user$.pipe(
    map((user) =>
      this.formBuilder.group({
        fullName: [user.fullName, Validators.required],
        email: [user.email],
        uid: [user.id],
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
    this.authService.signOut();
  }
}
