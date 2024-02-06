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
        loadComponent: () =>
          import('./containers/action-items/action-items.component').then(
            (m) => m.ActionItemsComponent
          ),
        data: { lessonType: LessonTypes.ActionItems } as LessonRouteData,
      },
      {
        path: `questions`,
        loadComponent: () =>
          import('./containers/questions/questions.component').then(
            (m) => m.QuestionsComponent
          ),
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
