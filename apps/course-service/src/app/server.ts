import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import * as express from 'express';
import admin from 'firebase-admin';

import { environment } from '../environments/environment';
import { AuthIdentity, RequestContext } from './auth-identity';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

/* Async verification with user token */
const verifyToken = async ({ authorization, schoolid }) => {
  if (!environment.production) {
    console.log('Running with mock data');
    return {
      admin: true,
      uid: 'XHjUUmEkvPc0Ye8SZlvtBTAAt622',
      schoolId: 'christianlydemann-eyy6e',
    } as AuthIdentity;
  }

  const newToken = authorization.replace('Bearer ', '');
  // TODO: disable for local env and set admin true
  const header = await admin
    .auth()
    .verifyIdToken(newToken)
    .then((decodedToken) => {
      if (decodedToken.firebase.tenant !== schoolid) {
        throw new AuthenticationError("User doesn't have access to school");
      }

      return {
        ...decodedToken,
        schoolId: schoolid,
      } as AuthIdentity;
    })
    .catch(function (error) {
      // Handle error
      throw new AuthenticationError('No Access: Invalid id token');
    });
  return header;
};

export function gqlServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      if (!req.headers.authorization) {
        return {
          req,
          res,
        } as RequestContext;
      }

      const auth = await verifyToken(req.headers as any);

      return {
        auth: auth || {},
        req,
        res,
      } as RequestContext;
    },
    // Enable graphiql gui
    introspection: true,
    playground: {
      endpoint: 'api',
    },
  });

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
}
