import { Lesson } from './lesson';

export interface CourseSection {
  id: string;
  name: string;
  lessons: Lesson[];
}
