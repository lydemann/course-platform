import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  exhaustMap,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { UserService } from '@course-platform/shared/auth/domain';
import {
  CourseResourcesService,
  CourseResourcesTrpcService,
  State,
  selectRouteParam,
} from '@course-platform/shared/domain';
import { CourseActions } from './course.actions';
import { CourseSelectors } from './course.selectors';
import { CourseClientFacade } from '../course-facade.service';

@Injectable()
export class CourseEffects {
  fetchCourseSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.courseInitiated, CourseActions.loadSections),
      withLatestFrom(this.store.select(CourseSelectors.selectCourseId)),
      filter(([_, courseId]) => !!courseId),
      mergeMap(([_, courseId]) => {
        return this.courseClientFacade.getCourseSections(courseId).pipe(
          map((courseSections) => {
            return CourseActions.getCourseSectionsSuccess({ courseSections });
          }),
          catchError((error) =>
            // TODO: use error action
            {
              /* TODO: use error action*/
              console.log('error', error);
              return of(CourseActions.getCourseSectionsFailed({ error }));
            }
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
        switchMap(([{ selectedSectionId }, sectionsMap, courseId]) => {
          return this.router.navigate([
            'courses',
            courseId,
            selectedSectionId,
            sectionsMap[selectedSectionId]!.lessons[0] || '0',
          ]);
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
      switchMap((action) => {
        return this.courseResourcesTrpcService
          .setCompleteLesson(action.isCompleted, action.lessonId)
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
      switchMap(([{ actionItemId, completed, sectionId }]) => {
        return this.courseResourcesTrpcService
          .setActionItemCompleted(actionItemId, completed)
          .pipe(
            map(() => CourseActions.setActionItemCompletedSuccess()),
            catchError((error) =>
              of(
                CourseActions.setActionItemCompletedFailed({
                  error,
                  actionItemId,
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
    private courseResourcesTrpcService: CourseResourcesTrpcService,
    private courseClientFacade: CourseClientFacade,
    private router: Router,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private store: Store<State>,
    private userService: UserService
  ) {}
}
