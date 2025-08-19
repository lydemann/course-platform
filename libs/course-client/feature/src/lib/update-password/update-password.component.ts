import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '@course-platform/course-client/shared/ui';

import {
  ACCESS_TOKEN_COOKIE_KEY,
  AuthSBService,
  UserCredentials,
} from '@course-platform/shared/auth/domain';
import { EmailOtpType } from '@supabase/auth-js';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
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
              <label class="error">{{ errorMessage() }}</label>
            </div>
            <div class="button-wrapper">
              <app-button
                type="submit"
                size="l"
                data-test="login-btn"
                (click)="resetPassword(resetPwdForm.value)"
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
  styleUrls: ['./update-password.component.scss'],
  standalone: true,
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class UpdatePasswordComponent implements OnInit {
  resetPwdForm!: UntypedFormGroup;
  errorMessage = signal('');

  private cookieService = inject(SsrCookieService);

  private cookieService = inject(SsrCookieService);

  constructor(
    public authService: AuthSBService,
    private router: Router,
    private fb: UntypedFormBuilder
  ) {
    this.createForm();
  }

  async ngOnInit() {
    // Extract token from URL and set session
    // Extract access_token from URL hash
    const urlHash = window.location.hash;
    const hashParams = new URLSearchParams(urlHash.substring(1));
    const type = hashParams.get('type');
    const token_hash = hashParams.get('token_hash');

    const errorMessage = hashParams.get('error_description');
    if (errorMessage) {
      this.errorMessage.set(errorMessage);
      return;
    }

    const token = hashParams.get('access_token');

    console.log('token', token);

    if (!token) {
      this.errorMessage.set('No token provided');
      return;
    }

    // Cast the authService to AuthSBService to access the authClient
    const { error } = await this.authService.authClient.verifyOtp({
      type: type as EmailOtpType,
      token_hash: token_hash as string,
    });

    if (error) {
      this.errorMessage.set(error.message);
      return;
    }

    const user = await this.authService.getUser();
    console.log('user', user);
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
