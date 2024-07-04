import { ActionItem, Lesson } from './lesson';

export interface CourseSection {
  id: string;
  theme: string;
  actionItems: ActionItem[];
  name: string;
  lessons: Lesson[];
}
