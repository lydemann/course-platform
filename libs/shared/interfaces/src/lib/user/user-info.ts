export interface UserLessonMeta {
  lessonId: string;
  lastUpdated: string;
  completed: boolean;
}

export interface UserInfo {
  completedLessons: UserLessonMeta[];
}
