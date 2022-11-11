import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { Apollo, gql } from 'apollo-angular';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export const schoolIdLocalStorageKey = 'schoolId';

@Injectable({
  providedIn: 'root',
})
export class SchoolIdService {
  constructor(private apollo: Apollo, private firebaseApp: FirebaseApp) {}

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
    this.firebaseApp.auth().tenantId = schoolId;
  }
}
