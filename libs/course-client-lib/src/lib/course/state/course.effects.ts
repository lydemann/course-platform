import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { CourseResourcesService } from '../resources/course-resources.service';
import { CourseSelectors } from '../state/course.selectors';
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

  lessonChanged$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.lessonChanged),
        withLatestFrom(
          this.store.select(CourseSelectors.selectSelectedSectionId)
        ),
        tap(([{ selectedLessonId }, selectedSectionId]) => {
          this.router.navigate(['course', selectedSectionId, selectedLessonId]);
        })
      );
    },
    { dispatch: false }
  );

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
    private courseResourcesService: CourseResourcesService,
    private router: Router,
    private store: Store
  ) {}
}
