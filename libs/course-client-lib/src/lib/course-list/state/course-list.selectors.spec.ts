import { CourseSection } from '@course-platform/shared/interfaces';
import {
  courseListAdapter,
  courseListInitState,
  CourseListState
} from './course-list.model';
import { CourseListSelectors } from './course-list.selectors';

describe('Course list selectors', () => {
  const initState = courseListInitState;
  describe('selectIsLoading', () => {
    it('should select isLoading', () => {
      initState.isLoading = true;

      const isLoading = CourseListSelectors.selectIsLoading.projector(
        initState
      );
      expect(isLoading).toBe(initState.isLoading);
    });
  });

  describe('getCourseSections', () => {
    it('should select course sections', () => {
      const courseSections = [{ id: '1' }] as CourseSection[];

      const stateWithSections = courseListAdapter.setAll(
        courseSections,
        initState
      );

      const sections = CourseListSelectors.selectCourseSections.projector(
        stateWithSections
      );
      expect(sections).toEqual(courseSections);
    });
  });
});
