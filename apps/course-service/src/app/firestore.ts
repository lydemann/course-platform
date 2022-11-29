import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

export const firestoreDB = admin.firestore();
