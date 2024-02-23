import { RouteMeta } from '@analogjs/router';
import { QuestionsComponent } from '@course-platform/course-client/feature';
import {
  LessonRouteData,
  LessonTypes,
} from '@course-platform/shared/interfaces';

export const routeMeta: RouteMeta = {
  data: { lessonType: LessonTypes.Questions } as LessonRouteData,
};

export default QuestionsComponent;
