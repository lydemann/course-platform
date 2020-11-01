export enum LessonTypes {
  Lesson = 'Lesson',
  ActionItems = 'ActionItems',
  Questions = 'Questions'
}

export interface LessonRouteData {
  lessonType: LessonTypes;
}
