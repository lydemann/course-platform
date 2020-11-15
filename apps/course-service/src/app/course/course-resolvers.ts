import { Course } from '@course-platform/shared/interfaces';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';

export const courseQueryResolvers = {
  course: (parent, args, context: RequestContext) => {
    console.log(context.auth.schoolId);
    console.log('Calling course: ');
    return firestoreDB
      .collection(`schools/${context.auth.schoolId}/courses`)
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data()) as Course[];
      })
      .then(data => {
        console.log(data);
        return data;
      });
  }
};
