import { Routes } from '@angular/router';

import {
  selectedLessonIdRouteParam,
  selectedSectionIdRouteParam,
} from '@course-platform/course-client/shared/domain';
import {
  LessonRouteData,
  LessonTypes,
} from '@course-platform/shared/interfaces';
import { RedirectToCourseResolver } from '../redirect-to-course.resolver';
import { ActionItemsComponent } from './containers/action-items/action-items.component';
import { CourseContentComponent } from './containers/course-content/course-content.component';
import { QuestionsComponent } from './containers/questions/questions.component';

export const courseRoutes: Routes = [
  {
    path: '',
    resolve: [RedirectToCourseResolver],
    loadComponent: () =>
      import('./course.component').then((m) => m.CourseComponent),
  },
  {
    path: `:${selectedSectionIdRouteParam}`,
    loadComponent: () =>
      import('./course.component').then((m) => m.CourseComponent),
    children: [
      {
        path: `action-items`,
        component: ActionItemsComponent,
        data: { lessonType: LessonTypes.ActionItems } as LessonRouteData,
      },
      {
        path: `questions`,
        component: QuestionsComponent,
        data: { lessonType: LessonTypes.Questions } as LessonRouteData,
      },
      {
        path: `:${selectedLessonIdRouteParam}`,
        component: CourseContentComponent,
        data: { lessonType: LessonTypes.Lesson } as LessonRouteData,
      },
    ],
  },
];
