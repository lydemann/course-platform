import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export const schoolIdLocalStorageKey = 'schoolId';

@Injectable({
  providedIn: 'root',
})
export class SchoolIdService {
  constructor(private apollo: Apollo, private auth: Auth) {}

  setSchoolIdFromCustomDomain() {
    const schoolId = 'christianlydemann-eyy6e';
    if (schoolId) {
      this.setFirebaseAuthSchoolId(schoolId);
      return of(schoolId);
    }

    const customDomain = '';
    return this.getSchoolId(customDomain).pipe(
      tap((schoolIdFromCustomDomain) => {
        let schoolId = schoolIdFromCustomDomain;
        if (!schoolIdFromCustomDomain) {
          schoolId = this.getSchoolIdFromSubdomain();
        }

        this.setFirebaseAuthSchoolId(schoolId);
      })
    );
  }

  private getSchoolIdFromSubdomain() {
    const urlParts = ''.split('.');

    const hostNameDotCount = 2;

    if (urlParts.length === hostNameDotCount - 1) {
      return 'christianlydemann-eyy6e';
    }

    if (urlParts.length <= hostNameDotCount) {
      return urlParts.shift();
    }

    const endOfSplitsIdx = urlParts.length;
    return urlParts.slice(0, endOfSplitsIdx - hostNameDotCount).join('.');
  }

  private getSchoolId(customDomain) {
    const query = gql`
      query getSchoolIdQuery($customDomain: String!) {
        schoolId(customDomain: $customDomain)
      }
    `;

    return this.apollo
      .query<{ schoolId: string }>({
        query,
        variables: {
          customDomain,
        },
      })
      .pipe(map(({ data }) => data.schoolId));
  }

  private setFirebaseAuthSchoolId(schoolId: string) {
    this.auth.tenantId = schoolId;
  }
}
