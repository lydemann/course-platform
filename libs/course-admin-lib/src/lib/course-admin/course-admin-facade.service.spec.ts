/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';

import { CourseAdminFacadeService } from './course-admin-facade.service';

describe('Service: CourseAdminFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseAdminFacadeService]
    });
  });

  it('should ...', inject(
    [CourseAdminFacadeService],
    (service: CourseAdminFacadeService) => {
      expect(service).toBeTruthy();
    }
  ));
});
