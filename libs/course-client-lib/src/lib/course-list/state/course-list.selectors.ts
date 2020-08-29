import { createFeatureSelector, createSelector } from '@ngrx/store';

import { courseListAdapter, CourseListState } from './course-list.model';

export namespace CourseListSelectors {
  export const getCourseListFeature = createFeatureSelector<CourseListState>(
    'courseList'
  );

  const { selectAll } = courseListAdapter.getSelectors();

  export const selectIsLoading = createSelector(
    getCourseListFeature,
    state => state.isLoading
  );

  export const selectCourseSections = createSelector(
    getCourseListFeature,
    selectAll
  );
}
