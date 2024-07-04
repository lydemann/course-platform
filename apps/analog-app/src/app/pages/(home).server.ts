import { PageServerLoad } from '@analogjs/router';

export const load = async ({ fetch, event }: PageServerLoad) => {
  return {
    loaded: true,
  };
};
