import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { SharedModule } from '@course-platform/course-client/shared/ui';

import { AuthService } from '@course-platform/shared/auth/domain';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
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
