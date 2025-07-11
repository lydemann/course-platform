import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { AuthService } from '@course-platform/shared/auth/domain';
import {
  Profile,
  ProfileFBService,
} from '@course-platform/course-client/shared/domain';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class ProfileComponent implements OnInit {
  user$!: Observable<Profile>;
  profileForm$!: Observable<FormGroup>;
  changePwForm!: FormGroup;
  errorMessage!: string;
  constructor(
    private profileService: ProfileFBService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user$ = this.profileService.getUserProfile();

    this.profileForm$ = this.user$.pipe(
      map((user) =>
        this.formBuilder.group({
          fullName: [user.fullName, Validators.required],
          email: [user.email],
          uid: [user.id],
        })
      )
    );

    this.changePwForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  onUpdateProfile(profileForm: FormGroup) {
    const fullName = profileForm.get('fullName')?.value;
    this.profileService.updateName(fullName);
  }

  async onChangePassword() {
    this.errorMessage = '';
    const currentPassword = this.changePwForm.get('currentPassword')?.value;
    const newPassword = this.changePwForm.get('newPassword')?.value;
    const confirmPassword = this.changePwForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = `Passwords don't match.`;
      return;
    }

    try {
      await this.profileService.updatePassword(newPassword, currentPassword);
      this.changePwForm.reset();
    } catch (error) {
      this.errorMessage = (error as Error).message ?? '';
    }
  }

  onLogout() {
    this.authService.signOut();
  }
}
