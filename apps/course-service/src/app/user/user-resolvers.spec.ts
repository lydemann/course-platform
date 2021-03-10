import { ValidationError } from 'apollo-server-express';

import { DITypes } from '../../di/di-types';
import { container } from '../../di/di.config';
import { mockInstantiatedClass } from '../../utils/jest-mock-class';
import { RequestContext } from '../auth-identity';
import { userMutationResolvers } from './user-resolvers';
import { CreateUserResponseDTO, UserService } from './user-service';

describe('User Resolvers', () => {
  describe('createUser', () => {
    let userService: jest.Mocked<UserService>;

    beforeEach(() => {
      userService = mockInstantiatedClass(UserService);
      container
        .rebind<UserService>(DITypes.userService)
        .toConstantValue(userService);
    });

    it('should not create user if not in ac list', async () => {
      const email = 'some@gmail.com';
      const password = 'somepassword';

      const users = [
        { email, firstName: 'somefirstname', lastName: 'somelastname' },
      ];
      const acUsersResponse = { contacts: users };
      userService.getACUsers.mockReturnValue(Promise.resolve(acUsersResponse));

      expect(
        userMutationResolvers.createUser(null, { email, password }, {
          auth: { schoolId: '123' },
        } as RequestContext)
      ).rejects.toEqual(new ValidationError('Email is not enrolled'));
      expect(userService.getACUsers).toHaveBeenCalled();
      expect(userService.createGoogleIdentityUser).not.toHaveBeenCalled();
    });

    it('should create user', async () => {
      const email = 'some@gmail.com';
      const password = 'somepassword';

      const users = [
        { email, firstName: 'somefirstname', lastName: 'somelastname' },
      ];
      const acUsersResponse = { contacts: users };
      userService.getACUsers.mockReturnValue(Promise.resolve(acUsersResponse));
      userService.createGoogleIdentityUser.mockReturnValue(
        Promise.resolve({ email } as CreateUserResponseDTO)
      );
      const tenantId = '123';
      const res = await userMutationResolvers.createUser(
        null,
        {
          email,
          password,
        },
        { auth: { schoolId: tenantId } } as RequestContext
      );

      expect(userService.getACUsers).toHaveBeenCalled();
      expect(userService.createGoogleIdentityUser).toHaveBeenCalledWith(
        email,
        password,
        tenantId
      );
      expect(res).toEqual({ email });
    });
  });
});
