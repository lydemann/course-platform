import {
  courseMutationResolvers,
  courseQueryResolvers,
} from './course/course-resolvers';
import { customDomainQueryResolvers } from './custom-domain/custom-domain-resolvers';
import { lessonMutationResolvers } from './lesson/lesson-resolvers';
import {
  sectionMutationResolvers,
  sectionQueryResolvers,
} from './section/section-resolvers';
import {
  userMutationResolvers,
  userQueryResolvers,
} from './user/user-resolvers';

export const resolvers = {
  Query: {
    ...sectionQueryResolvers,
    ...userQueryResolvers,
    ...courseQueryResolvers,
    ...customDomainQueryResolvers,
  },
  Mutation: {
    ...userMutationResolvers,
    ...sectionMutationResolvers,
    ...lessonMutationResolvers,
    ...courseMutationResolvers,
  },
};
