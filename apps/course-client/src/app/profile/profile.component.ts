import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { ProfileService } from '@course-platform/course-client-lib';
import { AuthService } from '@course-platform/shared/feat-auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$: Observable<firebase.User>;
  profileForm$: Observable<FormGroup>;
  changePwForm: FormGroup;
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user$ = this.profileService.getUserProfile();

    this.profileForm$ = this.user$.pipe(
      map(user => {
        return this.formBuilder.group({
          fullName: [user.displayName, Validators.required],
          email: [user.email],
          uid: [user.uid]
        });
      })
    );

    this.changePwForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onUpdateProfile(profileForm: FormGroup) {
    const fullName = profileForm.get('fullName').value;
    this.profileService.updateName(fullName);
  }

  onChangePassword() {
    const currentPassword = this.changePwForm.get('currentPassword').value;
    const newPassword = this.changePwForm.get('newPassword').value;
    const confirmPassword = this.changePwForm.get('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      return;
    }

    this.profileService.updatePassword(newPassword, currentPassword);
    this.changePwForm.reset();
  }

  onLogout() {
    this.authService.doLogout();
  }
}
