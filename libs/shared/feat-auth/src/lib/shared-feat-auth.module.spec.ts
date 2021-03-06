import { TestBed, waitForAsync } from '@angular/core/testing';

import { SharedFeatAuthModule } from './shared-feat-auth.module';

describe('SharedFeatAuthModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedFeatAuthModule]
      }).compileComponents();
    })
  );

  it('should create', () => {
    expect(SharedFeatAuthModule).toBeDefined();
  });
});
