/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';

import { CourseResolver } from './course.resolver';

describe('Service: Course', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseResolver]
    });
  });

  it('should ...', inject([CourseResolver], (service: CourseResolver) => {
    expect(service).toBeTruthy();
  }));
});
