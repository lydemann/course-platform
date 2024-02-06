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
import { QuestionsComponent } from './containers/questions/questions.component';

export const courseRoutes: Routes = [
  {
    path: '',
    resolve: [RedirectToCourseResolver],
    loadComponent: () =>
      import('./course-layout.component').then((m) => m.CourseLayoutComponent),
  },
  {
    path: `:${selectedSectionIdRouteParam}`,
    loadComponent: () =>
      import('./course-layout.component').then((m) => m.CourseLayoutComponent),
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
        loadComponent: () =>
          import('./containers/course-content/course-content.component').then(
            (m) => m.CourseContentComponent
          ),
        data: { lessonType: LessonTypes.Lesson } as LessonRouteData,
      },
    ],
  },
];
