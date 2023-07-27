import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SectionAdminFormComponent } from './section-admin-form/section-admin-form.component';
import { SectionAdminComponent } from './section-admin.component';
import { SectionAdminRoutingModule } from './section-admin.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SectionAdminRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SectionAdminComponent, SectionAdminFormComponent]
})
export class SectionAdminModule {}
