import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import admin from 'firebase-admin';

import { environment } from '../environments/environment';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

/* Async verification with user token */
const verifyToken = async idToken => {
  if (!environment.production) {
    return { admin: true, uid: 'test' };
  }

  if (idToken) {
    const newToken = idToken.replace('Bearer ', '');
    // TODO: disable for local env and set admin true
    const header = await admin
      .auth()
      .verifyIdToken(newToken)
      .then(decodedToken => {
        return decodedToken;
      })
      .catch(function(error) {
        // Handle error
        throw new Error('No Access');
      });
    return header;
  } else {
    throw new Error('No Access');
  }
};

export function gqlServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      // headers: req.headers,
      const auth = await verifyToken(req.headers.authorization);
      return {
        auth: auth || {},
        req,
        res
      };
    },
    // Enable graphiql gui
    introspection: true,
    playground: {
      endpoint: 'api'
    }
  });

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
}
