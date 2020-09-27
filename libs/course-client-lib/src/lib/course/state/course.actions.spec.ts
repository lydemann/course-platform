import { HttpErrorResponse } from '@angular/common/http';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseActions } from './course.actions';

describe('courseInitiated', () => {
  it('should be a fetchCourseSections-action', () => {
    const action = CourseActions.courseInitiated({
      selectedLessonId: '',
      selectedSectionId: ''
    });
    expect(action.type).toBe(CourseActions.courseInitiated.type);
  });
});

describe('fetchCourseSectionsSuccess', () => {
  it('should create a fetchCourseSectionsSuccess-action', () => {
    const courseSections = [{ id: '1' }] as CourseSection[];
    const action = CourseActions.getCourseSectionsSuccess({
      courseSections
    });
    expect(action.type).toBe(CourseActions.getCourseSectionsSuccess.type);
    expect(action.courseSections).toBe(courseSections);
  });
});

describe('fetchCourseSectionsFailed', () => {
  it('should create a fetchCourseSectionsFailed-action', () => {
    const error = { error: 'some error' } as HttpErrorResponse;
    const action = CourseActions.getCourseSectionsFailed({ error });
    expect(action.type).toBe(CourseActions.getCourseSectionsFailed.type);
    expect(action.error).toBe(error);
  });
});
