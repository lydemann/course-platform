import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { InMemoryCache } from '@apollo/client/cache';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { createPersistedQueryLink } from 'apollo-angular-link-persisted';
import { HttpLink } from 'apollo-angular/http';

import { ApolloClientOptions } from '@apollo/client/core';
import { Endpoints, ENDPOINTS_TOKEN } from '../endpoints';

const defaultOptions: any = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

export function createApollo(
  httpLink: HttpLink,
  endpoints: Endpoints
): ApolloClientOptions<any> {
  const requestLink = httpLink.create({
    uri: endpoints.courseServiceUrl,
    headers: new HttpHeaders({ 'x-apollo-operation-name': 'true' }),
  });
  const link = createPersistedQueryLink({
    useGETForHashedQueries: true,
  }).concat(requestLink as any) as any;

  return {
    link,
    cache: new InMemoryCache(),
    defaultOptions,
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
