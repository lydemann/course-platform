import { CourseSection } from '@course-platform/shared/interfaces';
import {
  courseInitState,
  courseSectionAdapter,
  CourseState
} from './course.model';
import { CourseSelectors } from './course.selectors';

describe('Course list selectors', () => {
  const initState = courseInitState;
  describe('selectIsLoading', () => {
    it('should select isLoading', () => {
      initState.sectionsState.isLoading = true;

      const isLoading = CourseSelectors.selectIsLoadingSections.projector(
        initState
      );
      expect(isLoading).toBe(initState.sectionsState.isLoading);
    });
  });

  describe('getCourseSections', () => {
    it('should select course sections', () => {
      const courseSections = [{ id: '1' }] as CourseSection[];

      const stateWithSections = courseSectionAdapter.setAll(
        courseSections,
        initState.sectionsState
      );

      const sections = CourseSelectors.selectCourseSections.projector(
        stateWithSections
      );
      expect(sections).toEqual(courseSections);
    });
  });
});
