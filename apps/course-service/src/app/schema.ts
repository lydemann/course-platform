import { Sectionschema } from './course-section/section-schema';
import { UserSchema } from './user/user-schema';

const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    courseSections: [Section]
    user(uid: String!): UserInfo
  }
  type Mutation {
    setLessonCompleted(isCompleted: Boolean!): String
  }
`;

export const typeDefs = [schema, Sectionschema, UserSchema];
