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
) {}

export function createDeleteMutationResolver<T, InfoT = any>(
  resourceUrlFn: ResolverFn<T>
) {
  return createResolver<T, InfoT>((parent, args, context, info) => {
    const resourceUrl = resourceUrlFn(parent, args, context, info);
    const resourceRef = firestoreDB.doc(resourceUrl);
    resourceRef.delete();

    return {};
  });
}
