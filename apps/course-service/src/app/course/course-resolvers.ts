import { AuthenticationError } from 'apollo-server-express';

import { Course } from '@course-platform/shared/interfaces';
import {
  createDeleteMutationResolver,
  createResolver,
} from '../../utils/create-resolver';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';

export const courseQueryResolvers = {
  course: (parent, args, context: RequestContext) => {
    return firestoreDB
      .collection(`schools/${context.auth.schoolId}/courses`)
      .get()
      .then((data) => {
        return data.docs.map((doc) => doc.data()) as Course[];
      })
      .then((data) => {
        console.log(data);
        return data;
      });
  },
};

export const courseMutationResolvers = {
  createCourse: createResolver<Course>(async (parent, args, { auth }) => {
    if (!auth.admin) {
      throw new AuthenticationError('User is not admin');
    }

    const newCourseRef = firestoreDB
      .collection(`schools/${auth.schoolId}/courses`)
      .doc();
    const id = newCourseRef.id;
    await newCourseRef.set({
      ...args,
      id,
    } as Course);

    return newCourseRef.get().then((snapshot) => snapshot.data());
  }),

  updateCourse: createResolver<Course>(async (parent, args, { auth }) => {
    if (!auth.admin) {
      throw new AuthenticationError('User is not admin');
    }
    const courseRef = firestoreDB.doc(
      `schools/${auth.schoolId}/courses/${args.id}`
    );
    await courseRef.set(
      {
        ...args,
      } as Course,
      { merge: true }
    );

    return courseRef.get().then((snapshot) => snapshot.data());
  }),

  deleteCourse: createDeleteMutationResolver<Pick<Course, 'id'>>(
    (parent, args, { auth }) => `schools/${auth.schoolId}/courses/${args.id}`
  ),
};
