import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CourseSection } from '@course-platform/shared/interfaces';

export interface CourseListState extends EntityState<CourseSection> {
  isLoading: boolean;
  error: HttpErrorResponse;
}

export const courseListAdapter: EntityAdapter<CourseSection> = createEntityAdapter<
  CourseSection
>({
  selectId: state => state.id
});

export const courseListInitState = courseListAdapter.getInitialState<
  CourseListState
>({
  entities: {},
  ids: [],
  isLoading: false,
  error: null
});
