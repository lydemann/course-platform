import { ApolloCache } from '@apollo/client/cache';
import { DocumentNode } from 'graphql';

export interface EntityObject {
  id: string;
}

export function createInCache<ReadQueryResponseT>(
  toCreate: EntityObject,
  readQuery: DocumentNode,
  cache: ApolloCache<any>,
  entityName: keyof ReadQueryResponseT
) {
  const existingEntities = cache.readQuery<
    Record<keyof ReadQueryResponseT, EntityObject[]>
  >({
    query: readQuery,
  });

  if (toCreate && existingEntities) {
    cache.writeQuery({
      query: readQuery,
      data: {
        [entityName]: [...existingEntities[entityName], toCreate],
      },
    });
  }
}

export function removeFromCache<ReadQueryResponseT>(
  toRemove: EntityObject,
  readQuery: DocumentNode,
  cache: ApolloCache<any>,
  entityName: keyof ReadQueryResponseT
) {
  const existingEntities = cache.readQuery<
    Record<keyof ReadQueryResponseT, EntityObject[]>
  >({
    query: readQuery,
  });

  if (toRemove && existingEntities) {
    cache.writeQuery({
      query: readQuery,
      data: {
        [entityName]: existingEntities[entityName].filter(
          (entity) => entity.id !== toRemove.id
        ),
      },
    });
  }
}
