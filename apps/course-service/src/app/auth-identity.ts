import express from 'express';
import admin from 'firebase-admin';

export interface AuthIdentity extends admin.auth.DecodedIdToken {
  admin: boolean;
  schoolId: string;
}

export interface RequestContext {
  auth: AuthIdentity;
  req: express.Request;
  res: express.Response;
}
