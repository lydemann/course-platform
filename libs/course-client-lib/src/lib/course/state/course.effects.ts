import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { CourseResourcesService } from '../resources/course-resources.service';
import { CourseActions } from './course.actions';

@Injectable()
export class CourseEffects {
  fetchCourseSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.courseInitiated),
      exhaustMap(() =>
        this.courseResourcesService.getCourseSections().pipe(
          map(courseSections =>
            CourseActions.getCourseSectionsSuccess({ courseSections })
          ),
          catchError(error =>
            of(CourseActions.getCourseSectionsFailed({ error }))
          )
        )
      )
    );
  });

  fetchSectionLessons$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.courseInitiated, CourseActions.sectionChanged),
      exhaustMap(action => {
        let courseSection = '0';

        if (action.type === CourseActions.sectionChanged.type) {
          courseSection = action.sectionId;
        }

        return this.courseResourcesService.getCourseLessons(courseSection).pipe(
          map(lessons => CourseActions.getSectionLessonsSuccess({ lessons })),
          catchError(error =>
            of(CourseActions.getSectionLessonsFailed({ error }))
          )
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private courseResourcesService: CourseResourcesService
  ) {}
}
