import { ActionItem, Lesson } from './lesson';

export interface CourseSection {
  actionItems: ActionItem[];
  id: string;
  name: string;
  lessons: Lesson[];
}
