/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';

import { RedirectIfAuthenticatedService } from './redirect-if-authenticated.service';

describe('Service: RedirectIfAuthenticated', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedirectIfAuthenticatedService]
    });
  });

  it('should ...', inject(
    [RedirectIfAuthenticatedService],
    (service: RedirectIfAuthenticatedService) => {
      expect(service).toBeTruthy();
    }
  ));
});
