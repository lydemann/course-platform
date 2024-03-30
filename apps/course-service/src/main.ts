import { region } from 'firebase-functions';

import dotenvJSON from 'dotenv-json';

import { gqlServer } from './app/server';
import { environment } from './environments/environment';
if (environment.local) {
  dotenvJSON({ path: __dirname + '/assets/env.local.json' });
} else {
  dotenvJSON({ path: __dirname + '/assets/env.json' });
}

const server = gqlServer();

// Graphql api
// https://us-central1-<project-name>.cloudfunctions.net/api/
const api = region('europe-west3').https.onRequest(server);

export { api };
