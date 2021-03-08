import { injectable } from 'inversify';

import { firestoreDB } from '../firestore';

@injectable()
export class UserService {
  getUserData<T = any>(
    schoolId: string,
    uid: string,
    userCollection: string
  ): Promise<T[]> {
    return firestoreDB
      .doc(`schools/${schoolId}/users/${uid}`)
      .collection(userCollection)
      .get()
      .then((snap) => {
        return snap.docs.map((doc) => {
          return doc.data() as T;
        });
      });
  }

  getACUsers(): Promise<{ email: string }[]> {
    const options = {
      method: 'GET',
      headers: {
        'Api-Token': process.env.acApiToken,
        'Content-Type': 'application/json',
      },
    };

    const fetch = require('node-fetch');
    return fetch(`${process.env.acOrigin}/api/3/contacts?listid=11`, options)
      .then(async (response) => {
        return await response.json();
      })
      .catch((err) => console.error(err));
  }
}
