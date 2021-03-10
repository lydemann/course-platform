import { Container } from 'inversify';
import 'reflect-metadata';

import { UserService } from '../app/user/user-service';
import { DITypes } from './di-types';

const container = new Container({ autoBindInjectable: true });
container.bind<UserService>(DITypes.userService).to(UserService);

export { container };
