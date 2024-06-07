import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../drizzle/db';
import { publicProcedure, router } from './../trpc';
import * as schema from '../../drizzle/db-schema';
import { protectedProcedure } from './utils/protected-procedure';
import { CourseSection } from '@course-platform/shared/interfaces';

const createSection = (name: string, courseId: string) => {
  return db
    .insert(schema.sections)
    .values({ name, courseId })
    .returning({ name: schema.sections.name });
};

const updateSection = (sectionId: string, name: string, theme: string) => {
  return db
    .update(schema.sections)
    .set({ name, theme })
    .where(eq(schema.sections.id, sectionId))
    .returning();
};

const deleteSection = (sectionId: string) => {
  return db
    .delete(schema.sections)
    .where(eq(schema.sections.id, sectionId))
    .returning();
};

export const sectionRouter = router({
  getAll: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ input: { courseId }, ctx: { user } }) => {
      const completedLessonsProm = db.query.completedLessons.findMany({
        where: eq(schema.completedLessons.userId, user.id),
      });

      const completedActionItemsProm = db.query.completedActionItems.findMany({
        where: eq(schema.completedLessons.userId, user.id),
      });

      const sectionsProm = db.query.sections.findMany({
        where: eq(schema.sections.courseId, courseId),
        with: {
          lessons: {
            with: {
              resources: true,
            },
          },
          actionItems: true,
        },
      });

      const data = await Promise.all([
        completedLessonsProm,
        completedActionItemsProm,
        sectionsProm,
      ]);

      const sections = data[2].map(
        (section) =>
          ({
            ...section,
            lessons: section.lessons.map((lesson) => ({
              ...lesson,
              isCompleted: data[0].some(
                (completedLesson) => completedLesson.lessonId === lesson.id
              ),
              actionItems: section.actionItems.map((actionItem) => ({
                ...actionItem,
                isCompleted: data[1].some(
                  (completedActionItem) =>
                    completedActionItem.actionItemId === actionItem.id
                ),
              })),
            })),
          } as CourseSection)
      );
      return sections;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(
      async ({ input }) => await createSection(input.name, input.courseId)
    ),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        theme: z.string(),
      })
    )
    .mutation(
      async ({ input }) =>
        await updateSection(input.id, input.name, input.theme)
    ),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => await deleteSection(input.id)),
});
