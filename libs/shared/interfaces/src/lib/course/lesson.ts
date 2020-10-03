export interface Lesson {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: LessonResource[];
  // set by client
  isCompleted?: boolean;
}

export interface LessonResource {
  id: string;
  name: string;
  url: string;
}
