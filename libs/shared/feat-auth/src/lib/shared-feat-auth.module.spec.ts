import { async, TestBed } from '@angular/core/testing';

import { SharedFeatAuthModule } from './shared-feat-auth.module';

describe('SharedFeatAuthModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedFeatAuthModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedFeatAuthModule).toBeDefined();
  });
});
