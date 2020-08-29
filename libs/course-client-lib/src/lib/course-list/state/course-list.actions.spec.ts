import { HttpErrorResponse } from '@angular/common/http';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseListActions } from './course-list.actions';

describe('fetchCourseSections', () => {
  it('should be a fetchCourseSections-action', () => {
    const action = CourseListActions.fetchCourseSections();
    expect(action.type).toBe(CourseListActions.fetchCourseSections.type);
  });
});

describe('fetchCourseSectionsSuccess', () => {
  it('should create a fetchCourseSectionsSuccess-action', () => {
    const courseSections = [{ id: '1' }] as CourseSection[];
    const action = CourseListActions.fetchCourseSectionsSuccess({
      courseSections
    });
    expect(action.type).toBe(CourseListActions.fetchCourseSectionsSuccess.type);
    expect(action.courseSections).toBe(courseSections);
  });
});

describe('fetchCourseSectionsFailed', () => {
  it('should create a fetchCourseSectionsFailed-action', () => {
    const error = { error: 'some error' } as HttpErrorResponse;
    const action = CourseListActions.fetchCourseSectionsFailed({ error });
    expect(action.type).toBe(CourseListActions.fetchCourseSectionsFailed.type);
    expect(action.error).toBe(error);
  });
});
