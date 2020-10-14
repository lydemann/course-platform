import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { LessonAdminComponent } from './lesson-admin.component';
import { LessonAdminRoutingModule } from './lesson-admin.routing';

@NgModule({
  imports: [SharedModule, LessonAdminRoutingModule, ReactiveFormsModule],
  declarations: [LessonAdminComponent]
})
export class LessonAdminModule {}
