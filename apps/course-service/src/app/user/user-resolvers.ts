import { AuthenticationError } from 'apollo-server-express';
import admin from 'firebase-admin';

import { firestoreDB } from '../firestore';

export function getUserData<T = any>(
  uid: string,
  userCollection: string
): Promise<T[]> {
  return firestoreDB
    .doc(`users/${uid}`)
    .collection(userCollection)
    .get()
    .then(snap => {
      return snap.docs.map(doc => {
        return doc.data() as T;
      });
    });
}

export const userQueryResolvers = {
  user: async (parent, { uid }, context) => {
    if (!context.auth.admin && uid !== context.auth.uid) {
      throw new AuthenticationError('User is not admin or user');
    }

    const completedLessons = await getUserData(uid, 'userLessonsCompleted');

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
  setLessonCompleted: (parent, { uid, lessonId, isCompleted }, context) => {
    if (!context.auth.admin && uid !== context.auth.uid) {
      throw new AuthenticationError('User is not admin or user');
    }

    return firestoreDB
      .doc(`users/${uid}/userLessonsCompleted/${lessonId}`)
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
      .doc(`users/${uid}/actionItemsCompleted/${id}`)
      .set({
        id,
        isCompleted
      } as ActionItemDTO)
      .then(() => `Got updated`);
  }
};
