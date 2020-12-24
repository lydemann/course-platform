import { region } from 'firebase-functions';

import { gqlServer } from './app/server';

const server = gqlServer();

// Graphql api
// https://us-central1-<project-name>.cloudfunctions.net/api/
const api = region('europe-west3').https.onRequest(server);

export { api };
