import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SharedUiModule } from '@course-platform/shared/ui';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    SharedUiModule,
  ],
  declarations: [LoginComponent],
})
export class LoginModule {}
