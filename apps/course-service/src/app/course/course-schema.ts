import { gql } from 'apollo-server-express';

export const courseQuerySchema = gql`
  type Course {
    id: ID
    name: String
  }
`;
