import { gql } from 'apollo-server-express';

export const UserQuerySchema = gql`
  type CompletedLesson @cacheControl(maxAge: 30, scope: PRIVATE) {
    lessonId: String
    completed: Boolean
    lastUpdated: String
  }

  type UserInfo @cacheControl(maxAge: 30, scope: PRIVATE) {
    completedLessons: [CompletedLesson]
  }

  type User @cacheControl(maxAge: 30, scope: PRIVATE) {
    email: String
  }
`;

export const userMutationSchema = `
  setLessonCompleted(
    isCompleted: Boolean!
    lessonId: String!
    uid: String!
  ): String
  
  setActionItemCompleted(uid: ID! id: String! isCompleted: Boolean!): String

  createUser(email: String! password: String!): User
`;
