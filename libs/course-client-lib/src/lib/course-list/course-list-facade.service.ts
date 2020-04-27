import { Injectable } from '@angular/core';
import { CourseSection } from '@course-platform/shared/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CourseListResourcesService } from './resources/course-list-resources.service';

export interface CourseListState {
  sections: CourseSection[];
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CourseListFacadeService {
  private store$ = new BehaviorSubject<CourseListState>({
    sections: [],
    isLoading: false
  });
  sections$: Observable<CourseSection[]> = this.store$.pipe(
    map(state => state.sections)
  );
  isLoading$: any;
  constructor(private courseListResourcesService: CourseListResourcesService) {}

  fetchSections() {
    this.store$.next({
      ...this.store$.value,
      isLoading: true
    });

    this.courseListResourcesService.getCourseSections().subscribe(sections => {
      this.store$.next({
        ...this.store$.value,
        isLoading: false,
        sections
      });
    });
  }
}
