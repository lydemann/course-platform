import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CreateUserComponent } from './create-user.component';
import { CreateUserRoutingModule } from './create-user.routing';

@NgModule({
  imports: [SharedModule, CreateUserRoutingModule],
  declarations: [CreateUserComponent],
})
export class CreateUserModule {}
