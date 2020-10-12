import admin from 'firebase-admin';

import { firestoreDB } from '../firestore';

export const userQueryResolvers = {
  user: async (parent, { uid }) => {
    const completedLessons = await firestoreDB
      .doc(`users/${uid}`)
      .collection('userLessonsCompleted')
      .get()
      .then(snap => {
        return snap.docs.map(doc => {
          console.log(doc.data());
          return doc.data();
        });
      });

    return {
      completedLessons
    };
  }
};

const FieldValue = admin.firestore.FieldValue;

export const userMutationResolvers = {
  setLessonCompleted: (parent, { uid, lessonId, isCompleted }) => {
    return firestoreDB
      .doc(`users/${uid}/userLessonsCompleted/${lessonId}`)
      .set({
        completed: isCompleted,
        lessonId,
        lastUpdated: FieldValue.serverTimestamp()
      })
      .then(() => `Got updated`);
  }
};
