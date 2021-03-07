/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';

import { CourseFacadeService } from './course-facade.service';

describe('Service: CourseFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseFacadeService],
    });
  });

  it('should ...', inject(
    [CourseFacadeService],
    (service: CourseFacadeService) => {
      expect(service).toBeTruthy();
    }
  ));
});
