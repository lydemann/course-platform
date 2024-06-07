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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
