import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

import {
  AuthFBService,
  AuthService,
} from '@course-platform/shared/auth/domain';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  emailFormControl!: UntypedFormControl;
  isResetMailSent!: boolean;
  errorMessage!: string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.emailFormControl = new UntypedFormControl(null, [
      Validators.required,
      Validators.email,
    ]);
  }

  async sendResetPasswordEmail(event: Event) {
    event.preventDefault();

    if (this.emailFormControl.invalid) {
      return;
    }

    try {
      await this.authService.sendPasswordResetEmail(
        this.emailFormControl.value
      );
    } catch (error) {
      this.errorMessage = (error as Error).message;
    }

    this.isResetMailSent = true;
  }
}
