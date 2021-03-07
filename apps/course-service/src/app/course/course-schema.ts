import { gql } from 'apollo-server-express';

export const courseQuerySchema = gql`
  type Course {
    id: ID
    name: String
    description: String
  }
`;

export const courseMutationSchema = `
  createCourse(name: String!, description: String!): Course
  updateCourse(id: ID!, name: String!, description: String!): Course
  deleteCourse(id: ID!): Course
`;
