export interface Lesson {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: LessonResource[];
}

export interface LessonResource {
  id: string;
  name: string;
  url: string;
}
