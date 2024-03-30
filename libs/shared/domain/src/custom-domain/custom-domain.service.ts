import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomDomainService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  constructor(private apollo: Apollo) {}

  getCustomDomain(): Observable<string> {
    const query = gql`
      query customDomain {
        customDomain
      }
    `;

    this.isLoadingSubject.next(true);
    return this.apollo
      .watchQuery<{ customDomain: string }>({
        query,
      })
      .valueChanges.pipe(
        map(({ data: { customDomain } }) => {
          this.isLoadingSubject.next(false);
          return customDomain;
        })
      );
  }

  updateCustomDomain(customDomain: string) {
    this.isLoadingSubject.next(true);

    const mutation = gql`
      mutation setCustomDomain($customDomain: String!) {
        setCustomDomain(customDomain: $customDomain)
      }
    `;

    return this.apollo
      .mutate<{ setCustomDomain: string }>({
        mutation,
        variables: {
          customDomain,
        },
      })
      .pipe(
        map(({ data }) => {
          return data?.setCustomDomain || '';
        })
      );
  }
}
