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

import { AuthService } from '@course-platform/shared/auth/domain';

@Component({
  selector: 'app-login',
  template: `<div class="container">
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
              (click)="tryLogin(loginForm.value)"
              class="submit-btn"
            >
              Log In
            </app-button>
          </div>
          <p class="center mt-m">
            <a routerLink="/forgot-password">Forgot password?</a>
          </p>
        </form>
      </div>
    </div>
  </div> `,
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

  tryLogin(value: unknown) {
    this.authService.doLogin(value).then(
      (res) => {
        this.router.navigate(['courses']);
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.message;
      }
    );
  }
}
