import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CourseComponent } from './course.component';
import { FeatureRoutingModule } from './course.routing';
import { SectionComponent } from './section/section.component';

@NgModule({
  imports: [CommonModule, SharedModule, FeatureRoutingModule],
  declarations: [
    CourseComponent,
    SectionComponent,
    TopbarComponent,
    CourseSidebarComponent
  ]
})
export class CourseModule {}
