import {
  courseMutationResolvers,
  courseQueryResolvers
} from './course/course-resolvers';
import { lessonMutationResolvers } from './lesson/lesson-resolvers';
import {
  sectionMutationResolvers,
  sectionQueryResolvers
} from './section/section-resolvers';
import {
  userMutationResolvers,
  userQueryResolvers
} from './user/user-resolvers';

export const resolvers = {
  Query: {
    ...sectionQueryResolvers,
    ...userQueryResolvers,
    ...courseQueryResolvers
  },
  Mutation: {
    ...userMutationResolvers,
    ...sectionMutationResolvers,
    ...lessonMutationResolvers,
    ...courseMutationResolvers
  }
};
