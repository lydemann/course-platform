import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseListActions } from './state/course-list.actions';
import { CourseListState } from './state/course-list.model';
import { CourseListSelectors } from './state/course-list.selectors';

@Injectable({
  providedIn: 'root'
})
export class CourseListFacadeService {
  sections$: Observable<CourseSection[]> = this.store.select(
    CourseListSelectors.selectCourseSections
  );
  isLoading$: Observable<boolean> = this.store.select(
    CourseListSelectors.selectIsLoading
  );
  constructor(private store: Store<CourseListState>) {}

  fetchSections() {
    this.store.dispatch(CourseListActions.fetchCourseSections());
  }
}
