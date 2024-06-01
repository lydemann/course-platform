import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../drizzle/db';
import { publicProcedure, router } from './../trpc';
import * as schema from '../../drizzle/db-schema';

const getSections = () => {
  return db.query.sections.findMany({
    with: {
      lessons: true,
      actionItems: true,
    },
  });
};

const createSection = (name: string) => {
  return db
    .insert(schema.sections)
    .values({ name })
    .returning({ name: schema.sections.name });
};

const updateSection = (sectionId: string, name: string) => {
  return db
    .update(schema.sections)
    .set({ name })
    .where(eq(schema.sections.id, sectionId))
    .returning();
};

const deleteSection = (sectionId: string) => {
  return db
    .delete(schema.sections)
    .where(eq(schema.sections.id, sectionId))
    .returning();
};

// create lesson
// const createLesson = (
//   sectionId: number,
//   name: string,
//   videoUrl: string,
//   description: string,
//   resources: string
// ) => {
//   return db
//     .insert(schema.lessons)
//     .values({
//       name,
//       videoUrl,
//       description,
//       resources,
//       sectionId,
//     })
//     .returning();
// };

// // update lesson
// const updateLesson = (
//   lessonId: number,
//   name: string,
//   videoUrl: string,
//   description: string,
//   resources: string
// ) => {
//   return db
//     .update(schema.lessons)
//     .set({ name, videoUrl, description, resources })
//     .where(eq(schema.lessons.id, lessonId))
//     .returning();
// };

// // delete lesson
// const deleteLesson = (lessonId: number) => {
//   return db
//     .delete(schema.lessons)
//     .where(eq(schema.lessons.id, lessonId))
//     .returning();
// };

export const sectionRouter = router({
  getAll: publicProcedure.query(async () => {
    return await getSections();
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => await createSection(input.name)),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => await updateSection(input.id, input.name)),
  remove: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => await deleteSection(input.id)),
});
