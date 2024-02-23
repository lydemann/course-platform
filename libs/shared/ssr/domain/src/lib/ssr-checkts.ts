import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export const getIsPlatformServer = () => {
  const platformId = inject(PLATFORM_ID);
  return isPlatformServer(platformId);
};

export const getIsPlatformBrowser = () => {
  const platformId = inject(PLATFORM_ID);
  return isPlatformBrowser(platformId);
};
