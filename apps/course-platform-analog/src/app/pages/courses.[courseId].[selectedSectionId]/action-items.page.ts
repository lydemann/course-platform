import { RouteMeta } from '@analogjs/router';
import { ActionItemsComponent } from '@course-platform/course-client/feature';
import {
  LessonRouteData,
  LessonTypes,
} from '@course-platform/shared/interfaces';

export const routeMeta: RouteMeta = {
  data: { lessonType: LessonTypes.ActionItems } as LessonRouteData,
};

export default ActionItemsComponent;
