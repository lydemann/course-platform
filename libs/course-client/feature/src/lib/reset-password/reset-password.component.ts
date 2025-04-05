import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '@course-platform/course-client/shared/ui';

import {
  AuthSBService,
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
          <form [formGroup]="resetPwdForm">
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
                (click)="resetPassword(resetPwdForm?.value)"
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
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class ResetPasswordComponent implements OnInit {
  resetPwdForm!: UntypedFormGroup;
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    // Extract token from URL and set session
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const type = params['type'];

      if (token && type) {
        // Cast the authService to AuthSBService to access the authClient
        const authSbService = this.authService as AuthSBService;
        authSbService.authClient
          .setSession({
            access_token: token,
            refresh_token: '',
          })
          .catch((error: Error) => {
            console.error('Error setting session:', error);
            this.errorMessage = 'Invalid or expired password reset link';
          });
      }
    });
  }

  createForm() {
    this.resetPwdForm = this.fb.group({
      password: ['', Validators.required],
    });
  }

  resetPassword(userCredentials: UserCredentials) {
    this.authService.updatePassword(userCredentials.password).then(
      (res) => {
        this.router.navigate(['login']);
      },
      (err) => {
        console.log('Error doing password reset', err);
        this.errorMessage = err.message;
      }
    );
  }
}
