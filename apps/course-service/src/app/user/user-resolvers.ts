import { firestoreDB } from '../firestore';

export const userResolver = {
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
