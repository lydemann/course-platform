export interface Lesson {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: LessonResource[];
  // set by client
  isCompleted?: boolean;
}

export enum LessonResourceType {
  WorkSheet = 'WORKSHEET',
  CheatSheet = 'CHEATSHEET',
  Other = 'OTHER'
}

export interface LessonResource {
  id: string;
  name: string;
  url: string;
  type: LessonResourceType;
}

export interface ActionItem {
  id: string;
  question: string;
  answerDescription?: string;
  isCompleted?: boolean;
}
