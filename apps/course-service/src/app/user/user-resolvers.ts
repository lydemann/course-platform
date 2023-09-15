import { AuthenticationError, ValidationError } from 'apollo-server-express';
import admin from 'firebase-admin';

import { UserInfo } from '@course-platform/shared/interfaces';
import { DITypes } from '../../di/di-types';
import { container } from '../../di/di.config';
import { createResolver } from '../../utils/create-resolver';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';
import { CreateUserResponseDTO, UserService } from './user-service';

export const userQueryResolvers = {
  user: async (parent, { uid }, context: RequestContext): Promise<UserInfo> => {
    if (!context.auth.admin && uid !== context.auth.uid) {
      throw new AuthenticationError('User is not admin or user');
    }

    const completedLessons = await container
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

const fieldValue = admin.firestore.FieldValue;

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
        lastUpdated: fieldValue.serverTimestamp(),
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
    async (parent, { email, password }): Promise<CreateUserResponseDTO> => {
      const emailLowerCase = email.toLowerCase();
      const userService = container.get<UserService>(DITypes.userService);
      const acUserDTO = await userService.getACUsers();
      const acUsers = new Set(
        acUserDTO.contacts.map((user) => user.email?.toLowerCase())
      );

      // TODO: when implementing for SaaS decode registration token containing an encrypted token with email and schoolId
      if (!acUsers.has(emailLowerCase)) {
        throw new ValidationError('Email is not enrolled');
      }

      // TODO: when implementing for SaaS no hardcoded school id
      console.log('creating user');
      return await userService.createGoogleIdentityUser(
        emailLowerCase,
        password,
        'christianlydemann-eyy6e'
      );
    }
  ),
};
