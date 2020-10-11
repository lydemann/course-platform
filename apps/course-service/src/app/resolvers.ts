import { sectionQueryResolvers } from './course-section/section-resolvers';
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
    ...userMutationResolvers
  }
};
