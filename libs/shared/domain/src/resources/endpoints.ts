import { InjectionToken } from '@angular/core';

export interface Endpoints {
  courseServiceUrl: string;
}

export const ENDPOINTS_TOKEN = new InjectionToken<Endpoints>('Endpoints');
