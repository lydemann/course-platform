/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'inversify';
import fetch from 'node-fetch';

import { firestoreDB } from '../firestore';

export interface CreateUserResponseDTO {
  email: string;
  idToken: string;
  localId: string;
  expiresIn: string;
  refreshToken: string;
}

export const getGoogleIdentityError = (errorCode) => {
  switch (errorCode) {
    case 'EMAIL_EXISTS':
      return 'The email has already been registered';
    default:
      return errorCode;
  }
};

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
      .then((snap) => snap.docs.map((doc) => doc.data() as T));
  }

  getACUsers(): Promise<{
    contacts: { email: string; firstName: string; lastName: string }[];
  }> {
    const options = {
      method: 'GET',
      headers: {
        'Api-Token': process.env.acApiToken,
        'Content-Type': 'application/json',
      },
    };

    return fetch(
      `${process.env.acOrigin}/api/3/contacts?listid=11&limit=0`,
      options
    ).then(async (response) => await response.json()) as any;
  }

  async createGoogleIdentityUser(
    email: string,
    password: string,
    tenantId: string
  ): Promise<CreateUserResponseDTO> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        tenantId,
      }),
    };

    const apiKey = process.env.googleIdentityApiKey;

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      options
    );
    if (response.ok) {
      return response.json() as any;
    } else {
      const errorCode =
        ((await response.json()) as any)?.error?.message ||
        'Error while creating user';
      const translatedErrorMessage = getGoogleIdentityError(errorCode);
      throw new Error(translatedErrorMessage);
    }
  }
}
