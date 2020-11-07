import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule {}
