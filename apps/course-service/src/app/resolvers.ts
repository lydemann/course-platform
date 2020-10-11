import { sectionResolvers } from './course-section/section-resolvers';
import { userResolver } from './user/user-resolvers';

export const resolvers = {
  Query: {
    ...sectionResolvers,
    ...userResolver
  }
};
