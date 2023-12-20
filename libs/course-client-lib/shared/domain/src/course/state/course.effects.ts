import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  filter,
  first,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { UserService } from '@course-platform/shared/auth-domain';
import {
  CourseResourcesService,
  selectRouteParam,
} from '@course-platform/shared/domain';
import { CourseActions } from './course.actions';
import { CourseSelectors } from './course.selectors';

@Injectable()
export class CourseEffects {
  fetchCourseSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.courseInitiated, CourseActions.loadSections),
      withLatestFrom(this.store.select(CourseSelectors.selectCourseId)),
      filter(([_, courseId]) => !!courseId),
      switchMap(([_, courseId]) => {
        return this.courseResourcesService.getCourseSections(courseId).pipe(
          first(),
          map((courseSections) =>
            CourseActions.getCourseSectionsSuccess({ courseSections })
          ),
          catchError((error) =>
            // TODO: use error action
            of(CourseActions.getCourseSectionsFailed({ error }))
          )
        );
      })
    );
  });
  sectionSelected$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.sectionSelected),
        withLatestFrom(
          this.store.select(CourseSelectors.selectSectionsEntitiesRaw),
          this.store.select(selectRouteParam('courseId'))
        ),
        switchMap(([{ selectedSectionId }, sectionsMap, courseId]) =>
          this.router.navigate([
            'courses',
            courseId,
            selectedSectionId,
            sectionsMap[selectedSectionId].lessons[0] || '0',
          ])
        )
      );
    },
    { dispatch: false }
  );

  lessonChanged$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.lessonChanged),
        withLatestFrom(
          this.store.select(CourseSelectors.selectSelectedSectionId),
          this.store.select(selectRouteParam('courseId'))
        ),
        tap(([{ selectedLessonId }, selectedSectionId, courseId]) => {
          this.router.navigate([
            'courses',
            courseId,
            selectedSectionId,
            selectedLessonId,
          ]);
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

  actionItemCompleted = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.actionItemCompletedChanged),
      withLatestFrom(this.store.select(CourseSelectors.selectCourseId)),
      filter(([_, courseId]) => !!courseId),
      switchMap(([{ resourceId, completed, sectionId }]) => {
        return this.courseResourcesService
          .setActionItemCompleted(resourceId, completed)
          .pipe(
            map(() => CourseActions.setActionItemCompletedSuccess()),
            catchError((error) =>
              of(
                CourseActions.setActionItemCompletedFailed({
                  error,
                  resourceId,
                  completed,
                  sectionId,
                })
              )
            )
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
