import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { SectionLessonsComponent } from './components/course-sidebar/section/section-lessons.component';
import { ActionItemsModule } from './containers/action-items/action-items.module';
import { CourseContentModule } from './containers/course-content/course-content.module';
import { QuestionsModule } from './containers/questions/questions.module';
import { CourseComponent } from './course.component';
import { FeatureRoutingModule } from './course.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FeatureRoutingModule,
    CourseContentModule,
    ActionItemsModule,
    QuestionsModule
  ],
  declarations: [
    CourseComponent,
    SectionLessonsComponent,
    CourseSidebarComponent
  ]
})
export class CourseModule {}
