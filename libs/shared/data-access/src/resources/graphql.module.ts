import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { Endpoints, ENDPOINTS_TOKEN } from './endpoints';

export function createApollo(
  httpLink: HttpLink,
  endpoints: Endpoints
): ApolloClientOptions<any> {
  return {
    link: httpLink.create({ uri: endpoints.courseServiceUrl }),
    cache: new InMemoryCache()
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, ENDPOINTS_TOKEN]
    }
  ]
})
export class GraphQLModule {}
