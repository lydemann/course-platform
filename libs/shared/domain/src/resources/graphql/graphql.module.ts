/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { InMemoryCache } from '@apollo/client/cache';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { createPersistedQueryLink } from 'apollo-angular-link-persisted';
import { HttpLink } from 'apollo-angular/http';
import { onError } from 'apollo-link-error';

import { ApolloClientOptions } from '@apollo/client/core';
import { Endpoints, ENDPOINTS_TOKEN } from '../endpoints';
import { skip } from 'rxjs';

export function createApollo(
  httpLink: HttpLink,
  endpoints: Endpoints
): ApolloClientOptions<any> {
  const requestLink = httpLink.create({
    uri: endpoints.courseServiceUrl,
    headers: new HttpHeaders({ 'x-apollo-operation-name': 'true' }),
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
      throw networkError;
    }

    graphQLErrors?.forEach((error) => {
      if (error.message === 'PersistedQueryNotFound') {
        console.error(error);
        return;
      }
      throw error;
    });
  });

  const link = createPersistedQueryLink({
    useGETForHashedQueries: true,
  })
    .concat(errorLink as any)
    .concat(requestLink as any) as any;

  return {
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
    connectToDevTools: true,
  };
}

@NgModule({
  imports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, ENDPOINTS_TOKEN],
    },
  ],
})
export class GraphQLModule {}
