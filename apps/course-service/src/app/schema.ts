import { courseQuerySchema } from './course/course-schema';
import { lessonMutations, lessonQuerySchema } from './lesson/lesson-schema';
import { sectionMutations, SectionSchema } from './section/section-schema';
import { userMutationSchema, UserQuerySchema } from './user/user-schema';

const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    courseSections(uid: ID!, courseId: ID!): [Section]
    user(uid: ID!): UserInfo
    course: [Course]
  }
  type Mutation {
    ${userMutationSchema}
    ${sectionMutations}
    ${lessonMutations}
  }
`;

export const typeDefs = [
  schema,
  courseQuerySchema,
  lessonQuerySchema,
  SectionSchema,
  UserQuerySchema
];
