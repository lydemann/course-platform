import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  courseLessonAdapter,
  courseSectionAdapter,
  CourseState
} from './course.model';

export namespace CourseSelectors {
  export const getCourseFeature = createFeatureSelector<CourseState>('course');

  const {
    selectAll: courseSectionsSelectAll
  } = courseSectionAdapter.getSelectors();
  const {
    selectAll: courseLessonsSelectAll
  } = courseLessonAdapter.getSelectors();

  export const selectIsLoadingSections = createSelector(
    getCourseFeature,
    state => state.sectionsState.isLoading
  );
  export const selectIsLoadingLessons = createSelector(
    getCourseFeature,
    state => state.lessonsState.isLoading
  );

  export const isCourseLoading = createSelector(
    selectIsLoadingSections,
    selectIsLoadingLessons,
    (isLoadingSections, isLoadingLessons) =>
      isLoadingSections || isLoadingLessons
  );

  export const selectCourseSectionsState = createSelector(
    getCourseFeature,
    state => state.sectionsState
  );

  export const selectCourseSections = createSelector(
    selectCourseSectionsState,
    courseSectionsSelectAll
  );

  export const selectCourseLessonsState = createSelector(
    getCourseFeature,
    state => state.lessonsState
  );
  export const selectCourseLessons = createSelector(
    selectCourseLessonsState,
    courseLessonsSelectAll
  );

  export const selectSelectedSectionId = createSelector(
    getCourseFeature,
    state => state.sectionsState.selectedSectionId
  );
}
