/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';

import { CustomDomainService } from './custom-domain.service';

describe('Service: CustomDomain', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomDomainService],
    });
  });

  it('should ...', inject(
    [CustomDomainService],
    (service: CustomDomainService) => {
      expect(service).toBeTruthy();
    }
  ));
});
