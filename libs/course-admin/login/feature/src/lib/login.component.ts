import { Component, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '@course-platform/course-admin/shared/ui';

import {
  AuthService,
  UserCredentials,
} from '@course-platform/shared/auth/domain';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.scss'],
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
                (click)="tryLogin(loginForm.value)"
                class="submit-btn"
              >
                Log In
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [SharedModule],
})
export class LoginComponent {
  loginForm!: UntypedFormGroup;
  errorMessage = '';
  private router = inject(Router);

  constructor(public authService: AuthService, private fb: UntypedFormBuilder) {
    console.log('login component');
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  tryLogin(value: UserCredentials) {
    this.authService.signIn(value.email, value.password).then(
      (res) => {
        // TODO: when extracting to shared component, set redirect url as input
        this.router.navigate(['courses']);
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.message;
      }
    );
  }
}
