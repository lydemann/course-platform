import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [SharedModule, ReactiveFormsModule, ForgotPasswordRoutingModule],
})
export class ForgotPasswordModule {}
