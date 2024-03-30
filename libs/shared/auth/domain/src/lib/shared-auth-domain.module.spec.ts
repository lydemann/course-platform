import { TestBed, waitForAsync } from '@angular/core/testing';

import { SharedAuthDomainModule } from './shared-auth-domain.module';

describe('SharedAuthDomainModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedAuthDomainModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedAuthDomainModule).toBeDefined();
  });
});
