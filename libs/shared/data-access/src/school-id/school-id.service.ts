import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { auth } from 'firebase';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export const schoolIdLocalStorageKey = 'schoolId';

@Injectable({
  providedIn: 'root',
})
export class SchoolIdService {
  constructor(private apollo: Apollo) {}

  setSchoolIdFromCustomDomain() {
    const schoolIdLocalStorage = localStorage.getItem(schoolIdLocalStorageKey);
    if (schoolIdLocalStorage) {
      this.setFirebaseAuthSchoolId(schoolIdLocalStorage);
      return of(schoolIdLocalStorage);
    }

    const customDomain = location.hostname;
    return this.getSchoolId(customDomain).pipe(
      tap((schoolIdFromCustomDomain) => {
        let schoolId = schoolIdFromCustomDomain;
        if (!schoolIdFromCustomDomain) {
          schoolId = this.getSchoolIdFromSubdomain();
        }

        this.setFirebaseAuthSchoolId(schoolId);
        localStorage.setItem(schoolIdLocalStorageKey, schoolId);
      })
    );
  }

  private getSchoolIdFromSubdomain() {
    const urlParts = location.hostname.split('.');

    const hostNameDotCount = 2;

    if (urlParts.length === hostNameDotCount - 1) {
      return 'christianlydemann-eyy6e';
    }

    if (urlParts.length <= hostNameDotCount) {
      return urlParts.shift();
    }

    const endOfSplitsIdx = urlParts.length - 1;
    return urlParts.slice(endOfSplitsIdx - hostNameDotCount).join('.');
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
      .pipe(
        map(({ data }) => {
          return data.schoolId;
        })
      );
  }

  private setFirebaseAuthSchoolId(schoolId: string) {
    auth().tenantId = schoolId;
  }
}
