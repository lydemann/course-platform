import { RequestContext } from '../app/auth-identity';
import { firestoreDB } from '../app/firestore';

export declare type ResolverFn<T, InfoT = any> = (
  parent: any,
  args: T,
  context?: RequestContext,
  info?: InfoT
) => any;

export function createResolver<T, InfoT = any>(
  resolverFn: ResolverFn<T, InfoT>
) {
  return resolverFn;
}

export function createDeleteMutationResolver<T, InfoT = any>(
  resourceUrlFn: ResolverFn<T>
) {
  return createResolver<T, InfoT>(async (parent, args, context, info) => {
    const resourceUrl = resourceUrlFn(parent, args, context, info);
    const resourceRef = firestoreDB.doc(resourceUrl);
    const toDelete = await resourceRef.get().then((snap) => snap.data());
    resourceRef.delete();

    return toDelete;
  });
}
