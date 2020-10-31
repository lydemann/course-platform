import { lessonMutations } from './lesson/lesson-schema';
import { sectionMutations, SectionSchema } from './section/section-schema';
import { UserSchema } from './user/user-schema';

const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    courseSections(uid: String): [Section]
    user(uid: String!): UserInfo
  }
  type Mutation {
    setLessonCompleted(
      isCompleted: Boolean!
      lessonId: String!
      uid: String!
    ): String
    ${sectionMutations}
    ${lessonMutations}
  }
`;

export const typeDefs = [schema, SectionSchema, UserSchema];
