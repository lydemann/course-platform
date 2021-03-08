import { AuthenticationError, ValidationError } from 'apollo-server-express';
import admin from 'firebase-admin';
import {} from 'inversify';

import { UserInfo } from '@course-platform/shared/interfaces';
import { myContainer } from '../../di/di.config';
import { createResolver } from '../../utils/create-resolver';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';
import { UserService } from './user-service';

export const userQueryResolvers = {
  user: async (parent, { uid }, context: RequestContext): Promise<UserInfo> => {
    if (!context.auth.admin && uid !== context.auth.uid) {
      throw new AuthenticationError('User is not admin or user');
    }

    const completedLessons = await myContainer
      .get(UserService)
      .getUserData(context.auth.schoolId, uid, 'userLessonsCompleted');

    return {
      completedLessons,
    };
  },
};

export interface ActionItemDTO {
  id: string;
  isCompleted: boolean;
}

export interface CreateUserInputDTO {
  email: string;
  password: string;
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
        lastUpdated: FieldValue.serverTimestamp(),
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
        isCompleted,
      } as ActionItemDTO)
      .then(() => `Got updated`);
  },
  createUser: createResolver<CreateUserInputDTO>(
    async (parent, { email }, {}) => {
      const acUsers = new Set(
        (await myContainer.get(UserService).getACUsers()).map(
          (user) => user.email
        )
      );

      if (!acUsers.has(email)) {
        throw new ValidationError('Email is not enrolled');
      }
    }
  ),
};
