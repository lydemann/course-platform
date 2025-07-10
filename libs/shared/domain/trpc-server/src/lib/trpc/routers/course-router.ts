import { db } from '../../drizzle/db';
import { router } from '../trpc';
import * as schema from '../../drizzle/out/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { protectedProcedure } from './utils/protected-procedure';
import { adminProcedure } from './utils/admin-procedure';

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

const updateCourse = (
  id: string,
  name: string,
  description: string,
  customStyling?: string
) => {
  return db
    .update(schema.courses)
    .set({ name, description, customStyling })
    .where(eq(schema.courses.id, id))
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
    try {
      return await getAllCourses();
    } catch (error) {
      console.error('Error getting all courses', error);
      throw error;
    }
  }),
  create: adminProcedure
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
  delete: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id } }) => {
      return await deleteCourse(id);
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        customStyling: z.string().optional(),
      })
    )
    .mutation(async ({ input: { id, name, description, customStyling } }) => {
      return await updateCourse(id, name, description, customStyling);
    }),
});
