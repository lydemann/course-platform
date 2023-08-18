import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Apollo, gql } from 'apollo-angular';

export const CREATE_USER_MUTATION = gql`
  mutation createUserMutation($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      email
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  constructor(private apollo: Apollo) {}

  createUser(email: string, password: string) {
    return this.apollo.mutate<{ createUser: User }>({
      mutation: CREATE_USER_MUTATION,
      variables: {
        email,
        password,
      },
    });
  }
}
