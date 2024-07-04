/* eslint-disable @typescript-eslint/naming-convention */
import { Observable } from 'rxjs';

import {
  Course,
  CourseSection,
  Lesson,
} from '@course-platform/shared/interfaces';

export interface CourseSectionDTO {
  id: string;
  name: string;
  theme: string;
}

export interface CompletedLessonData {
  lessonId: string;
  completed: boolean;
  lastUpdated: boolean;
}

export interface GetCourseSectionsResponseDTO {
  courseSections: CourseSection[];
  user: {
    completedLessons: CompletedLessonData[];
  };
}

export interface GetCoursesResponseDTO {
  course: Course[];
}

export abstract class CourseResourcesService {
  abstract getCourses(): Observable<Course[]>;
  abstract getCourseSections(courseId: string): Observable<CourseSection[]>;
  abstract setCompleteLesson(
    isCompleted: boolean,
    lessonId: string
  ): Observable<unknown>;
  abstract createLesson(
    sectionId: string,
    lessonName?: string,
    courseId?: string
  ): Observable<Lesson>;
  abstract updateLesson(
    lesson: Lesson,
    courseId: string,
    sectionId: string
  ): Observable<unknown>;
  abstract deleteLesson(
    sectionId: string,
    lessonId: string,
    courseId: string
  ): Observable<unknown>;
  abstract setActionItemCompleted(
    resourceId: string,
    completed: boolean
  ): Observable<unknown>;
  abstract createSection(
    sectionName: string,
    courseId: string
  ): Observable<CourseSectionDTO>;
  abstract updateSection(
    sectionId: string,
    sectionName: string,
    sectionTheme: string,
    courseId: string
  ): Observable<CourseSectionDTO>;
  abstract deleteSection(
    sectionId: string,
    courseId: string
  ): Observable<unknown>;
}
