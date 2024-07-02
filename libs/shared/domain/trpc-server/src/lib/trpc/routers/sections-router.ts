import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../drizzle/db';
import { router } from './../trpc';
import * as schema from '../../drizzle/db-schema';
import { protectedProcedure } from './utils/protected-procedure';
import {
  ActionItem,
  CourseSection,
  LessonResourceType,
} from '@course-platform/shared/interfaces';
import { User } from '@supabase/auth-js';
import { getDefaultActionItems } from './default-action-items';

const createSection = (name: string, courseId: string) => {
  return db
    .insert(schema.sections)
    .values({ name, courseId, theme: '' })
    .returning({
      id: schema.sections.id,
      name: schema.sections.name,
      theme: schema.sections.theme,
      courseId: schema.sections.courseId,
    });
};

const updateSection = (sectionId: string, name: string, theme: string) => {
  return db
    .update(schema.sections)
    .set({ name, theme })
    .where(eq(schema.sections.id, sectionId))
    .returning({
      id: schema.sections.id,
      name: schema.sections.name,
      theme: schema.sections.theme,
      courseId: schema.sections.courseId,
    });
};

const deleteSection = (sectionId: string) => {
  return db
    .delete(schema.sections)
    .where(eq(schema.sections.id, sectionId))
    .returning();
};

async function getSections(user: User, courseId: string) {
  try {
    const completedLessonsProm = db.query.completedLessons.findMany({
      where: eq(schema.completedLessons.userId, user.id),
    });
    const completedActionItemsProm = db.query.completedActionItems.findMany({
      where: eq(schema.completedLessons.userId, user.id),
    });
    const sectionsProm = db.query.sections.findMany({
      where: (sections, { eq }) => eq(sections.courseId, courseId),
      with: {
        lessons: {
          orderBy: (lesson, { asc }) => [asc(lesson.orderId)],
          with: {
            resources: true,
          },
        },
      },
    });

    const [completedLessons, completedActionItems, sections] =
      await Promise.all([
        completedLessonsProm,
        completedActionItemsProm,
        sectionsProm,
      ]);

    const userCompletedActionItemsSet = new Set(
      completedActionItems.map((actionItem) => actionItem.actionItemId)
    );

    return await sections.map((section) => {
      const actionItems = section.lessons.reduce(
        (prev: ActionItem[], lesson) => [
          ...prev,
          ...(lesson.resources || [])
            .filter(
              (resource) =>
                resource.type === LessonResourceType.WorkSheet &&
                !prev.find(
                  (prevActionItem) => prevActionItem.id === resource.id
                )
            )
            .map(
              (resource) =>
                ({
                  ...resource,
                  question: `Have you completed the worksheet from lesson "${lesson.name}" called: "${resource.name}"?`,
                  isCompleted: userCompletedActionItemsSet.has(resource.id),
                  answerDescription: '',
                } as ActionItem)
            ),
        ],
        [...getDefaultActionItems(section.id, userCompletedActionItemsSet)]
      );

      return {
        ...section,
        actionItems,
        lessons: section.lessons.map((lesson) => {
          const isLessonCompleted = completedLessons.some(
            (completedLesson) => completedLesson.lessonId === lesson.id
          );

          return {
            ...lesson,
            isCompleted: isLessonCompleted,
          };
        }),
      } as CourseSection;
    });
  } catch (error) {
    console.error('Error getting all sections', error);
    throw error;
  }
}

export const sectionRouter = router({
  getAll: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ input: { courseId }, ctx: { user } }) => {
      return await getSections(user, courseId);
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [model] = await createSection(input.name, input.courseId);
      return model;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        theme: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const [model] = await updateSection(input.id, input.name, input.theme);
      return model;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => await deleteSection(input.id)),
});
