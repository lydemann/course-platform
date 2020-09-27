import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

export interface CourseState {
  sectionsState: SectionsState;
  lessonsState: LessonsState;
}

export interface SectionsState extends EntityState<CourseSection> {
  selectedSectionId: string;
  isLoading: boolean;
  error: HttpErrorResponse;
}
export const courseSectionAdapter: EntityAdapter<CourseSection> = createEntityAdapter<
  CourseSection
>({
  selectId: state => state.id
});

export interface LessonsState extends EntityState<Lesson> {
  isLoading: boolean;
  error: HttpErrorResponse;
  selectedLessonId: string;
}

export const courseLessonAdapter: EntityAdapter<Lesson> = createEntityAdapter<
  Lesson
>({
  selectId: state => state.id
});

export const courseInitState = {
  lessonsState: courseLessonAdapter.getInitialState({
    entities: {},
    ids: [],
    error: null,
    isLoading: false
  }),
  sectionsState: courseSectionAdapter.getInitialState({
    entities: {},
    ids: [],
    error: null,
    isLoading: false
  })
} as CourseState;
