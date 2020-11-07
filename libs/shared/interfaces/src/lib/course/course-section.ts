import { ActionItem, Lesson } from './lesson';

export interface CourseSection {
  theme: any;
  actionItems: ActionItem[];
  id: string;
  name: string;
  lessons: Lesson[];
}
