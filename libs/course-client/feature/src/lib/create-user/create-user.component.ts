import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '@course-platform/course-client/shared/ui';

import { AuthSBService } from '@course-platform/shared/auth/domain';

@Component({
  selector: 'app-invite-user',
  template: `<div class="container">
    <div class="login-box">
      <div class="header">
        <h1 class="brand">Angular Architect Accelerator</h1>
      </div>
      <div class="form-wrapper">
        <p class="mb-2">
          Receive email to sign up (use the email you used for purchase AAA)
        </p>
        <form [formGroup]="createUserForm">
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
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              data-test="password"
              class="form-control"
              formControlName="confirmPassword"
            />
          </div>
          <div class="button-wrapper">
            <app-button
              type="submit"
              size="l"
              data-test="login-btn"
              [disabled]="!createUserForm.valid"
              (click)="createUser(createUserForm.value)"
              class="submit-btn"
            >
              Create User
            </app-button>
          </div>
          <p class="pt-2">{{ statusMessage }}</p>
        </form>
      </div>
    </div>
  </div> `,
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class CreateUserComponent {
  createUserForm = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });
  statusMessage = '';

  constructor(
    public authService: AuthSBService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  createUser(createUSerFormValues: typeof this.createUserForm.value) {
    if (this.createUserForm.invalid) {
      this.statusMessage = 'Please fill out all fields';
      return;
    }

    if (
      !createUSerFormValues.email ||
      !createUSerFormValues.email.includes('@')
    ) {
      this.statusMessage = 'Invalid email';
      return;
    }

    if (!createUSerFormValues.password) {
      this.statusMessage = 'Invalid password';
      return;
    }

    if (
      createUSerFormValues?.password &&
      createUSerFormValues?.password?.length < 6
    ) {
      this.statusMessage = 'Password must be at least 6 characters';
      return;
    }

    if (
      createUSerFormValues.password !== createUSerFormValues.confirmPassword
    ) {
      this.statusMessage = 'Passwords do not match';
      return;
    }

    this.authService
      .signUp(createUSerFormValues.email, createUSerFormValues.password)
      .then(
        (res) => {
          console.log('User created', res);
          this.statusMessage = 'User created. Going to /login to sign in...';
          const REDIRECT_TO_LOGIN_DELAY = 3000;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, REDIRECT_TO_LOGIN_DELAY);
        },
        (err) => {
          console.log('Error creating user', err);
          this.statusMessage = err.message;
        }
      );
  }
}
