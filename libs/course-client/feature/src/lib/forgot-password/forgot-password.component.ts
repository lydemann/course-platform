import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthService } from '@course-platform/shared/auth/domain';
import { SharedUiModule } from '@course-platform/shared/ui';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [SharedUiModule, CommonModule, RouterModule, ReactiveFormsModule],
})
export class ForgotPasswordComponent implements OnInit {
  emailFormControl!: UntypedFormControl;
  isResetMailSent = signal(false);
  errorMessage = signal('');
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

    this.errorMessage.set('');

    try {
      await this.authService
        .sendPasswordResetEmail(this.emailFormControl.value)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          if (response?.error) {
            this.errorMessage.set(response.error.message);
            return;
          }
        });
    } catch (error) {
      this.errorMessage.set((error as Error).message);
    }

    this.isResetMailSent.set(true);
  }
}
