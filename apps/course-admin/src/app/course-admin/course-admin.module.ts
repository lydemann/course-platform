import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CourseAdminComponent } from './course-admin.component';
import { CourseAdminRoutingModule } from './course-admin.routing';

@NgModule({
  imports: [SharedModule, CourseAdminRoutingModule],
  declarations: [CourseAdminComponent]
})
export class CourseAdminModule {}
