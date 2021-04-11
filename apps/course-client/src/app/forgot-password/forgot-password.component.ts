import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from '@course-platform/shared/feat-auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  emailFormControl: FormControl;
  isResetMailSent: boolean;
  errorMessage: string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.emailFormControl = new FormControl(null, [
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
      this.errorMessage = error.message;
    }

    this.isResetMailSent = true;
  }
}
