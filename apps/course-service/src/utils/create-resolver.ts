import { AuthenticationError } from 'apollo-server-express';

import { RequestContext } from '../app/auth-identity';
import { firestoreDB } from '../app/firestore';

export declare type ResolverFn<ArgsT, InfoT = any> = (
  parent: any,
  args: ArgsT,
  context?: RequestContext,
  info?: InfoT
) => any;

export function createResolver<ArgsT, InfoT = any>(
  resolverFn: ResolverFn<ArgsT, InfoT>
) {
  return resolverFn;
}

export function createDeleteMutationResolver<T, InfoT = any>(
  resourceUrlFn: ResolverFn<T>
) {
  return createResolver<T, InfoT>(async (parent, args, context, info) => {
    if (!context.auth.admin) {
      throw new AuthenticationError('User is not admin');
    }
    const resourceUrl = resourceUrlFn(parent, args, context, info);
    const resourceRef = firestoreDB.doc(resourceUrl);
    const toDelete = await resourceRef.get().then((snap) => snap.data());
    resourceRef.delete();

    return toDelete;
  });
}
