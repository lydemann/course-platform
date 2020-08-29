import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';

import { CourseSection } from '@course-platform/shared/interfaces';

export namespace CourseListActions {
  export const fetchCourseSections = createAction(
    '[Course List] Fetch Course Sections'
  );
  export const fetchCourseSectionsSuccess = createAction(
    '[Course List] Fetch Course Sections Success',
    props<{ courseSections: CourseSection[] }>()
  );
  export const fetchCourseSectionsFailed = createAction(
    '[Course List] Fetch Course Sections Failed',
    props<{ error: HttpErrorResponse }>()
  );

  export const all = union({
    fetchCourseSections,
    fetchCourseSectionsSuccess,
    fetchCourseSectionsFailed
  });
}

export type CourseListActionsUnion = typeof CourseListActions.all;
