import { gql } from 'apollo-server-express';
import {
  courseMutationSchema,
  courseQuerySchema,
} from './course/course-schema';
import {
  customDomainMutations,
  customDomainQueries,
} from './custom-domain/custom-domain-schema';
import { lessonMutations, lessonQuerySchema } from './lesson/lesson-schema';
import { SectionSchema, sectionMutations } from './section/section-schema';
import { UserQuerySchema, userMutationSchema } from './user/user-schema';

const schema = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type Query {
    courseSections(uid: String, courseId: String, sectionIds: [String]): [Section]
    user(uid: String!): UserInfo @cacheControl(maxAge: 30, scope: PRIVATE)
    course: [Course]
    ${customDomainQueries}
  }
  type Mutation {
    ${userMutationSchema}
    ${sectionMutations}
    ${lessonMutations}
    ${courseMutationSchema}
    ${customDomainMutations}
  }
`;

export const typeDefs = [
  schema,
  courseQuerySchema,
  lessonQuerySchema,
  SectionSchema,
  UserQuerySchema,
];
