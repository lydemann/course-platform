import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '@course-platform/course-client/shared/ui';

import {
  AuthService,
  UserCredentials,
} from '@course-platform/shared/auth/domain';

@Component({
  selector: 'app-login',
  template: `
    <div class="container">
      <div class="login-box">
        <div class="header">
          <h1 class="brand">Angular Architect Accelerator</h1>
        </div>
        <div class="form-wrapper">
          <h3>Reset Password</h3>
          <form [formGroup]="loginForm">
            <div class="form-group">
              <label>New Password</label>
              <input
                type="password"
                data-test="password"
                class="form-control"
                formControlName="password"
              />
              <label class="error">{{ errorMessage }}</label>
            </div>
            <div class="button-wrapper">
              <app-button
                type="submit"
                size="l"
                data-test="login-btn"
                (click)="resetPassword(loginForm.value)"
                class="submit-btn"
              >
                Reset password
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class ResetPasswordComponent {
  loginForm!: UntypedFormGroup;
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: UntypedFormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  resetPassword(userCredentials: UserCredentials) {
    this.authService.updatePassowrd(userCredentials.password).then(
      (res) => {
        this.router.navigate(['login']);
      },
      (err) => {
        console.log('Error doing sign in', err);
        this.errorMessage = err.message;
      }
    );
  }
}
