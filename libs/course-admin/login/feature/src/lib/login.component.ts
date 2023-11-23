import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@course-platform/shared/auth-domain';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
