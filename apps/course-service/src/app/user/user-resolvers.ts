import { AuthenticationError } from 'apollo-server-express';
import admin from 'firebase-admin';

import { UserInfo } from '@course-platform/shared/interfaces';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';

export function getUserData<T = any>(
  schoolId: string,
  uid: string,
  userCollection: string
): Promise<T[]> {
  return firestoreDB
    .doc(`schools/${schoolId}/users/${uid}`)
    .collection(userCollection)
    .get()
    .then(snap => {
      return snap.docs.map(doc => {
        return doc.data() as T;
      });
    });
}

export const userQueryResolvers = {
  user: async (parent, { uid }, context: RequestContext): Promise<UserInfo> => {
    if (!context.auth.admin && uid !== context.auth.uid) {
      throw new AuthenticationError('User is not admin or user');
    }

    const completedLessons = await getUserData(
      context.auth.schoolId,
      uid,
      'userLessonsCompleted'
    );

    return {
      completedLessons
    };
  }
};

export interface ActionItemDTO {
  id: string;
  isCompleted: boolean;
}

const FieldValue = admin.firestore.FieldValue;

export const userMutationResolvers = {
  setLessonCompleted: (
    parent,
    { uid, lessonId, isCompleted },
    context: RequestContext
  ) => {
    if (!context.auth.admin && uid !== context.auth.uid) {
      throw new AuthenticationError('User is not admin or user');
    }

    return firestoreDB
      .doc(
        `schools/${context.auth.schoolId}/users/${uid}/userLessonsCompleted/${lessonId}`
      )
      .set({
        completed: isCompleted,
        lessonId,
        lastUpdated: FieldValue.serverTimestamp()
      })
      .then(() => `Got updated`);
  },
  setActionItemCompleted: (parent, { uid, id, isCompleted }, context) => {
    if (!context.auth.admin && uid !== context.auth.uid) {
      throw new AuthenticationError('User is not admin or requested user');
    }

    return firestoreDB
      .doc(
        `schools/${context.auth.schoolId}/users/${uid}/actionItemsCompleted/${id}`
      )
      .set({
        id,
        isCompleted
      } as ActionItemDTO)
      .then(() => `Got updated`);
  }
};
