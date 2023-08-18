import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { CreateUserComponent } from './create-user.component';
import { CreateUserRoutingModule } from './create-user.routing';

@NgModule({
  imports: [SharedModule, CreateUserRoutingModule],
  declarations: [CreateUserComponent],
})
export class CreateUserModule {}
