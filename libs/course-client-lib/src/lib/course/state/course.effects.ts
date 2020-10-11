import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  first,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';

import { CourseResourcesService } from '@course-platform/shared/data-access';
import { UserService } from '@course-platform/shared/feat-auth';
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
            // TODO: use error action
            of(CourseActions.getCourseSectionsFailed({ error }))
          )
        )
      )
    );
  });

  sectionSelected$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.sectionSelected),
        switchMap(({ selectionSectionId }) => this.router.navigate([section]))
      );
    },
    { dispatch: false }
  );

  sectionChangedSectionLessonsSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.sectionSelected),
        tap(({ selectionSectionId, lessons }) => {
          this.router.navigate(['course', selectionSectionId, lessons[0].id]);
        })
      );
    },
    { dispatch: false }
  );

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

  lessonCompleted$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.lessonCompleted),
      withLatestFrom(this.userService.getCurrentUser()),
      switchMap(([action, user]) => {
        return this.courseResourcesService
          .setCompleteLesson(action.isCompleted, action.lessonId, user.uid)
          .pipe(
            map(() => CourseActions.lessonCompletedSuccess()),
            catchError((error: Error) => {
              return of(CourseActions.lessonCompletedFailed({ error }));
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private courseResourcesService: CourseResourcesService,
    private router: Router,
    private store: Store,
    private userService: UserService
  ) {}
}
