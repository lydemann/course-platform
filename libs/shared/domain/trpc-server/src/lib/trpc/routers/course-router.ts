import { db } from '../../drizzle/db';
import { publicProcedure, router } from '../trpc';
import * as schema from '../../drizzle/db-schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { protectedProcedure } from './utils/protected-procedure';

const getAllCourses = async () => {
  return await db.query.courses.findMany();
};

const createCourse = (
  id: string,
  name: string,
  description: string,
  customStyling?: string
) => {
  return db
    .insert(schema.courses)
    .values({ id, name, description, customStyling })
    .returning({ name: schema.courses.name });
};

const deleteCourse = (courseId: string) => {
  return db
    .delete(schema.courses)
    .where(eq(schema.courses.id, courseId))
    .returning();
};

export const courseRouter = router({
  getAll: protectedProcedure.query(async () => {
    console.log('Getting all courses');
    try {
      return await getAllCourses();
    } catch (error) {
      console.error('Error getting all courses', error);
      throw error;
    }
  }),
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(
      async ({ input: { id, description, name } }) =>
        await createCourse(id, name, description)
    ),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id } }) => {
      return await deleteCourse(id);
    }),
});
