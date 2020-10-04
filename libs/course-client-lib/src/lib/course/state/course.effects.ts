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
            of(CourseActions.getCourseSectionsFailed({ error }))
          )
        )
      )
    );
  });

  sectionSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.sectionSelected),
      switchMap(({ selectionSectionId }) =>
        // TODO: dispatch action with lessons and trigger navigation in other effect
        this.courseResourcesService.getCourseLessons(selectionSectionId).pipe(
          map(lessons => {
            return CourseActions.sectionChangedSectionLessonsSuccess({
              lessons,
              selectionSectionId
            });
          }),
          catchError(error =>
            of(CourseActions.getSectionLessonsFailed({ error }))
          )
        )
      )
    );
  });

  sectionChangedSectionLessonsSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(CourseActions.sectionChangedSectionLessonsSuccess),
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

  fetchSectionLessons$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseActions.courseInitiated, CourseActions.sectionChanged),
      map(action => {
        let courseSection = '0';

        if (action.type === CourseActions.courseInitiated.type) {
          courseSection = action.selectedSectionId;
        }
        if (action.type === CourseActions.sectionChanged.type) {
          courseSection = action.sectionId;
        }
        return courseSection;
      }),
      withLatestFrom(this.userService.getCurrentUser()),
      exhaustMap(([courseSection, user]) => {
        return forkJoin([
          this.courseResourcesService
            .getCourseLessons(courseSection)
            .pipe(first()),
          this.courseResourcesService
            .getCompletedLessons(user.uid)
            .pipe(first())
        ]).pipe(
          map(([lessons, completedLessons]) =>
            lessons.map(lesson => ({
              ...lesson,
              isCompleted: completedLessons[lesson.id]?.isCompleted || false
            }))
          ),
          map(lessons => CourseActions.getSectionLessonsSuccess({ lessons })),
          catchError(error =>
            of(CourseActions.getSectionLessonsFailed({ error }))
          )
        );
      })
    );
  });

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
