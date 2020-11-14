import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  ApolloClientOptions,
  ApolloLink,
  createHttpLink,
  InMemoryCache
} from '@apollo/client/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from 'apollo-link-context';
import firebase from 'firebase';

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
export class GraphQLModule {
  /**
   *
   */
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    this.init();
  }

  async init() {
    // const idToken = await firebase.auth().currentUser.getIdToken();
    // // const httpLink = createHttpLink({ uri: this.endpoints.courseServiceUrl });
    // const authLink = setContext((operation, context) => ({
    //   headers: {
    //     Authorization: `Bearer ${idToken}`
    //   }
    // })) as any;
    // const link = ApolloLink.from([authLink]);
    // this.apollo.client.setLink(link);
  }
}
