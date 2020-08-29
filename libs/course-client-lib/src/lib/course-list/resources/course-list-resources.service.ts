import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@course-platform/course-client-env';
import { CourseSection } from '@course-platform/shared/interfaces';

export const COURSE_SECTIONS_URL = '/api/sections';

@Injectable({
  providedIn: 'root'
})
export class CourseListResourcesService {
  constructor(private httpClient: HttpClient) {}

  getCourseSections(): Observable<CourseSection[]> {
    const courseSectionsUrl =
      environment.courseServiceUrl + COURSE_SECTIONS_URL;
    return this.httpClient.get<CourseSection[]>(courseSectionsUrl);
  }
}
