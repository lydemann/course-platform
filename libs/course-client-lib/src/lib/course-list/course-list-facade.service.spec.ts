/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CourseListFacadeService } from './course-list-facade.service';

describe('Service: CourseListFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseListFacadeService]
    });
  });

  it('should ...', inject([CourseListFacadeService], (service: CourseListFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
