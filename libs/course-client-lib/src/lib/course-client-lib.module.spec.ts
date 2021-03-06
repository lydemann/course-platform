import { TestBed, waitForAsync } from '@angular/core/testing';

import { CourseClientLibModule } from './course-client-lib.module';

describe('CourseClientLibModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CourseClientLibModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(CourseClientLibModule).toBeDefined();
  });
});
