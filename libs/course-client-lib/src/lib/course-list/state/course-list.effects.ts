import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { CourseListResourcesService } from '../resources/course-list-resources.service';
import { CourseListActions } from './course-list.actions';

@Injectable()
export class CourseListEffects {
  fetchCourseSections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CourseListActions.fetchCourseSections),
      exhaustMap(() =>
        this.courseListResourcesService.getCourseSections().pipe(
          map(courseSections =>
            CourseListActions.fetchCourseSectionsSuccess({ courseSections })
          ),
          catchError(error =>
            of(CourseListActions.fetchCourseSectionsFailed({ error }))
          )
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private courseListResourcesService: CourseListResourcesService
  ) {}
}
