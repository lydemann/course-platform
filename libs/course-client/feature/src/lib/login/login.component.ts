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
          <form [formGroup]="loginForm">
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                formControlName="email"
                data-test="email"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label>Password</label>
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
                (click)="signIn(loginForm.value)"
                class="submit-btn"
              >
                Log In
              </app-button>
            </div>
            <p class="center mt-4">
              <a routerLink="/forgot-password">Forgot password?</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class LoginComponent {
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

  signIn(userCredentials: UserCredentials) {
    this.authService
      .signIn(userCredentials.email, userCredentials.password)
      .then(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res: any) => {
          if (res?.error) {
            this.errorMessage = res.error.message;
            return;
          }
          this.router.navigate(['courses']);
        },
        (err) => {
          console.log('Error doing sign in', err);
          this.errorMessage = err.message;
        }
      );
  }
}
