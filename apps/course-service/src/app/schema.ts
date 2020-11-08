import { lessonMutations, lessonQuerySchema } from './lesson/lesson-schema';
import { sectionMutations, SectionSchema } from './section/section-schema';
import { userMutationSchema, UserQuerySchema } from './user/user-schema';

const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    courseSections(uid: String): [Section]
    user(uid: String!): UserInfo
  }
  type Mutation {
    ${userMutationSchema}
    ${sectionMutations}
    ${lessonMutations}
  }
`;

export const typeDefs = [
  schema,
  lessonQuerySchema,
  SectionSchema,
  UserQuerySchema
];
