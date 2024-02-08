import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import * as rxjs from 'rxjs';
import { map } from 'rxjs/operators';

import { CustomDomainService } from '@course-platform/shared/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-custom-domain',
  templateUrl: './custom-domain.component.html',
  styleUrls: ['./custom-domain.component.scss'],
})
export class CustomDomainComponent {
  isLoading$: Observable<boolean>;
  customDomainFormControl$: rxjs.Observable<UntypedFormControl>;

  constructor(private customDomainService: CustomDomainService) {
    this.isLoading$ = this.customDomainService.isLoading$;
    this.customDomainFormControl$ = this.customDomainService
      .getCustomDomain()
      .pipe(
        map((customDomain) => {
          return new UntypedFormControl(customDomain, Validators.required);
        })
      );
  }

  save(customDomainFormControl: UntypedFormControl) {
    this.customDomainService
      .updateCustomDomain(customDomainFormControl.value)
      .subscribe();
  }
}
