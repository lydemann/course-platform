import { async, TestBed } from '@angular/core/testing';

import { CourseClientLibModule } from './course-client-lib.module';

describe('CourseClientLibModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CourseClientLibModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CourseClientLibModule).toBeDefined();
  });
});
