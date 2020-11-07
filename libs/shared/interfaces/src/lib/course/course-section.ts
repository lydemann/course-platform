import { ActionItem, Lesson } from './lesson';

export interface CourseSection {
  theme: string;
  actionItems: ActionItem[];
  id: string;
  name: string;
  lessons: Lesson[];
}
