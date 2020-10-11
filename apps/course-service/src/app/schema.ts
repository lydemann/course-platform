import { Sectionschema } from './course-section/section-schema';
import { UserSchema } from './user/user-schema';

const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    courseSections: [Section]
    user(uid: String!): UserInfo
  }
`;

export const typeDefs = [schema, Sectionschema, UserSchema];
