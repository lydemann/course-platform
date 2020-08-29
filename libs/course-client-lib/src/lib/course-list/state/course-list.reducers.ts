import { createReducer, on } from '@ngrx/store';

import {
  CourseListActions,
  CourseListActionsUnion
} from './course-list.actions';
import {
  courseListAdapter,
  courseListInitState,
  CourseListState
} from './course-list.model';

export const courseListReducer = createReducer<
  CourseListState,
  CourseListActionsUnion
>(
  courseListInitState,
  on(CourseListActions.fetchCourseSections, (state, action) => ({
    ...state,
    isLoading: true
  })),
  on(
    CourseListActions.fetchCourseSectionsSuccess,
    (state, { courseSections }) => ({
      ...courseListAdapter.setAll(courseSections, state),
      isLoading: false
    })
  ),
  on(CourseListActions.fetchCourseSectionsFailed, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  }))
);
