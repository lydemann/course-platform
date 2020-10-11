import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';

import { resolvers } from './resolvers';
import { typeDefs } from './schema';

export function gqlServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    // Enable graphiql gui
    introspection: true,
    playground: true
  });

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
}
