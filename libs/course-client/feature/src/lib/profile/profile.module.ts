import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProfileRoutingModule,
  ],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
