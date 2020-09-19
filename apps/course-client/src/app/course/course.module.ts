import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CourseContentComponent } from './components/course-content/course-content.component';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { SectionComponent } from './components/course-sidebar/section/section.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CourseComponent } from './course.component';
import { FeatureRoutingModule } from './course.routing';

@NgModule({
  imports: [CommonModule, SharedModule, FeatureRoutingModule],
  declarations: [
    CourseComponent,
    SectionComponent,
    TopbarComponent,
    CourseSidebarComponent,
    CourseContentComponent
  ]
})
export class CourseModule {}
