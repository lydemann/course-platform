import { PageServerLoad } from '@analogjs/router';

export const load = async ({
  params, // params/queryParams from the request
  req, // H3 Request
  res, // H3 Response handler
  fetch, // internal fetch for direct API calls,
  event, // full request event
}: PageServerLoad) => {
  // const courseResourcesTrpcService = inject(CourseResourcesTrpcService);
  // const courses = await firstValueFrom(courseResourcesTrpcService.getCourses())
  // console.log('courses', courses);
  // fix can't inject
  return {
    courses: [],
  };
};
