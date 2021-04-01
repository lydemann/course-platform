import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { SchoolIdService } from './school-id.service';

@Injectable({ providedIn: 'root' })
export class SchoolIdResolver implements Resolve<string> {
  constructor(private schoolIdService: SchoolIdService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return this.schoolIdService.setSchoolIdFromCustomDomain();
  }
}
