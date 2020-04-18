import { CourseSection } from './course-section';

export interface Course {
  id: string;
  name: string;
  sections: CourseSection[];
}
