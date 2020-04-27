import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CourseSection } from '@course-platform/shared/interfaces';
import { Observable } from 'rxjs';

export const COURSE_SECTIONS_URL = 'http://localhost:3333/api/sections';

@Injectable({
  providedIn: 'root'
})
export class CourseListResourcesService {
  constructor(private httpClient: HttpClient) {}

  getCourseSections(): Observable<CourseSection[]> {
    return this.httpClient.get<CourseSection[]>(COURSE_SECTIONS_URL); // TODO: get from env config
  }
}
