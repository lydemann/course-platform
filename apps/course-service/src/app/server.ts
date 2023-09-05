// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from '@apollo/server';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { AuthenticationError } from 'apollo-server-express';
import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import admin from 'firebase-admin';
import http from 'http';
import { environment } from '../environments/environment';
import { AuthIdentity, RequestContext } from './auth-identity';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

interface MyContext {
  token?: string;
}

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

export async function gqlServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    persistedQueries: {
      ttl: 900, // 15 minutes
    },
    plugins: [
      responseCachePlugin({
        sessionId: async (requestContext) =>
          requestContext.request.http.headers.get('authorization') || null,
      }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          auth: await verifyToken({
            authorization: req.headers.authorization,
            schoolid: req.headers.schoolid,
          }),
        } as RequestContext;
      },
    })
  );

  const PORT = 5000;
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT, path: '/' }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);

  return app;
}
