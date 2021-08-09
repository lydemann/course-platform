import { NgModule } from '@angular/core';
import {
  ApolloClientOptions,
  DefaultOptions,
  InMemoryCache,
} from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { createPersistedQueryLink } from 'apollo-angular-link-persisted';
import { HttpLink } from 'apollo-angular/http';

import { Endpoints, ENDPOINTS_TOKEN } from '../endpoints';

const defaultOptions: DefaultOptions = {
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
  const requestLink = httpLink.create({ uri: endpoints.courseServiceUrl });
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
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, ENDPOINTS_TOKEN],
    },
  ],
})
export class GraphQLModule {}
