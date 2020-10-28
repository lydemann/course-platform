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
    ...userQueryResolvers
  },
  Mutation: {
    ...userMutationResolvers,
    ...sectionMutationResolvers,
    ...lessonMutationResolvers
  }
};
