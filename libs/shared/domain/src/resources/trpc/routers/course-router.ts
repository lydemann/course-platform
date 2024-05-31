import { db } from '../drizzle/db';
import { publicProcedure, router } from '../trpc';
import * as schema from '../drizzle/db-schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { sectionRouter } from './sections-router';

const getAllCourses = async () => {
  return await db.query.courses.findMany();
};

const createCourse = (name: string, description: string) => {
  return db
    .insert(schema.courses)
    .values({ name, description })
    .returning({ name: schema.courses.name });
};

const deleteCourse = (courseId: string) => {
  return db
    .delete(schema.courses)
    .where(eq(schema.courses.id, courseId))
    .returning();
};

export const courseRouter = router({
  getAll: publicProcedure.query(async () => await getAllCourses()),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(
      async ({ input: { description, name } }) =>
        await createCourse(name, description)
    ),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input: { id } }) => {
      return await deleteCourse(id);
    }),
});
