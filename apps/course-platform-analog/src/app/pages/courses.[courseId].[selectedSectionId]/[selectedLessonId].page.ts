import { RouteMeta } from '@analogjs/router';
import { CanActivateFn } from '@angular/router';
import { CourseContentComponent } from '@course-platform/course-client/feature';
import {
  LessonRouteData,
  LessonTypes,
} from '@course-platform/shared/interfaces';

export const routeMeta: RouteMeta = {
  data: { lessonType: LessonTypes.Lesson } as LessonRouteData,
};

export default CourseContentComponent;
