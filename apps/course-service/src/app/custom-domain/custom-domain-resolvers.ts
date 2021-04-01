import { createResolver } from '../../utils/create-resolver';
import { firestoreDB } from '../firestore';

export interface SchoolIdFromCustomDomainInput {
  customDomain: string;
}

export const customDomainQueryResolvers = {
  schoolId: createResolver<SchoolIdFromCustomDomainInput>(
    async (_, { customDomain }) => {
      const schoolsSnapshot = await firestoreDB
        .collection('schools')
        .where('customDomain', '==', customDomain)
        .get();

      return schoolsSnapshot.docs.length ? schoolsSnapshot.docs[0].id : null;
    }
  ),
};
