import * as admin from 'firebase-admin';

admin.initializeApp();
export const firestoreDB = admin.firestore();
