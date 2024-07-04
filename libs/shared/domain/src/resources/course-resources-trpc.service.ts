/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';

import {
  Course,
  CourseSection,
  Lesson,
} from '@course-platform/shared/interfaces';
import { injectTRPCClient } from '@course-platform/shared/domain/trpc-client';
import {
  CourseResourcesService,
  CourseSectionDTO,
} from './course-resources.service';

@Injectable({
  providedIn: 'root',
})
export class CourseResourcesTrpcService implements CourseResourcesService {
  private trpcClient = injectTRPCClient();

  getCourses(): Observable<Course[]> {
    return this.trpcClient.course.getAll.query().pipe(
      map((data) => {
        return data.map(
          (course) =>
            ({
              id: course.id,
              name: course.name,
              description: course.description,
              customStyling: course.customStyling,
            } as Course)
        );
      })
    );
  }

  getCourseSections(courseId: string): Observable<CourseSection[]> {
    return this.trpcClient.section.getAll.query({ courseId }).pipe(
      timeout(2000),
      map((data) => data)
    );
  }

  setCompleteLesson(isCompleted: boolean, lessonId: string) {
    return this.trpcClient.lesson.setCompleted.mutate({
      lessonId,
      isCompleted,
    });
  }

  createLesson(
    sectionId: string,
    lessonName = '',
    courseId: string
  ): Observable<Lesson> {
    return this.trpcClient.lesson.createLessson.mutate({
      courseId,
      sectionId,
      name: lessonName,
      description: '',
      videoUrl: '',
    });
  }

  updateLesson(lesson: Lesson, courseId: string, sectionId: string) {
    return this.trpcClient.lesson.updateLesson.mutate({
      courseId,
      id: lesson.id,
      name: lesson.name,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      resources: lesson.resources,
      sectionId,
    });
  }

  deleteLesson(lessonId: string) {
    return this.trpcClient.lesson.deleteLesson.mutate({
      lessonId,
    });
  }

  setActionItemCompleted(actionItemId: string, isCompleted: boolean) {
    return this.trpcClient.lesson.setActionItemCompleted.mutate({
      actionItemId,
      isCompleted,
    });
  }

  createSection(
    sectionName: string,
    courseId: string
  ): Observable<CourseSectionDTO> {
    return this.trpcClient.section.create.mutate({
      courseId,
      name: sectionName,
    });
  }

  updateSection(
    sectionId: string,
    sectionName: string,
    sectionTheme: string
  ): Observable<CourseSectionDTO> {
    return this.trpcClient.section.update.mutate({
      id: sectionId,
      name: sectionName,
      theme: sectionTheme,
    });
  }

  deleteSection(sectionId: string) {
    return this.trpcClient.section.remove.mutate({
      id: sectionId,
    });
  }
}
