import { gql } from 'apollo-server-express';

export const courseQuerySchema = gql`
  type Course {
    id: ID
    name: String
  }
`;

export const courseMutationSchema = gql`
  createCourse(courseId: ID!, name: String!, description: String): Course
  updateCourse(courseId: ID!, name: String, description: String): Course
  deleteCourse(courseId: ID!)
`;
