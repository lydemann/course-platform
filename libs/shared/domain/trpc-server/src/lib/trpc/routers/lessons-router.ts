import { z } from 'zod';
import { db } from '../../drizzle/db';
import { router } from '../trpc';
import { protectedProcedure } from './utils/protected-procedure';
import {
  completedActionItems,
  completedLessons,
  lessons,
} from '../../drizzle/db-schema';
import { and, desc, eq } from 'drizzle-orm';
import { Lesson } from '@course-platform/shared/interfaces';

export const lessonRouter = router({
  setCompleted: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        isCompleted: z.boolean(),
      })
    )
    .mutation(async ({ input: { lessonId, isCompleted }, ctx: { user } }) => {
      if (isCompleted) {
        return await db
          .insert(completedLessons)
          .values({
            lessonId,
            userId: user.id,
          })
          .onConflictDoUpdate({
            target: [completedLessons.lessonId, completedLessons.userId],
            set: { lessonId, userId: user.id },
          })
          .returning();
      } else {
        return await db
          .delete(completedLessons)
          .where(
            and(
              eq(completedLessons.lessonId, lessonId),
              eq(completedLessons.userId, user.id)
            )
          )
          .returning();
      }
    }),
  // create lesson
  createLessson: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        courseId: z.string(),
        sectionId: z.string(),
        description: z.string(),
        videoUrl: z.string(),
      })
    )
    .mutation(async ({ input: { sectionId, description, videoUrl, name } }) => {
      const createdLesson = await db
        .insert(lessons)
        .values({
          sectionId,
          description,
          videoUrl: videoUrl,
          name,
        })
        .returning();

      return {
        id: createdLesson[0].id,
        description: createdLesson[0].description,
        videoUrl: createdLesson[0].videoUrl,
        name: createdLesson[0].name,
        sectionId: createdLesson[0].sectionId,
        resources: [],
        isCompleted: false,
      } as Lesson;
    }),
  // update lesson
  updateLesson: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        courseId: z.string(),
        sectionId: z.string(),
        description: z.string(),
        videoUrl: z.string(),
        resources: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            url: z.string(),
            type: z.enum(['WORKSHEET', 'CHEATSHEET', 'OTHER']),
          })
        ),
      })
    )
    .mutation(
      async ({
        input: {
          id,
          courseId,
          sectionId,
          name,
          description,
          videoUrl,
          resources,
        },
      }) => {
        await db
          .update(lessons)
          .set({
            name,
            description,
            videoUrl,
          })
          .where(eq(lessons.id, id))
          .returning();
      }
    ),
  // delete lesson
  deleteLesson: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .mutation(async ({ input: { lessonId } }) => {
      await db.delete(lessons).where(eq(lessons.id, lessonId)).returning();
    }),
  setActionItemCompleted: protectedProcedure
    .input(
      z.object({
        actionItemId: z.string(),
        isCompleted: z.boolean(),
      })
    )
    .mutation(
      async ({ input: { actionItemId, isCompleted }, ctx: { user } }) => {
        if (isCompleted) {
          return await db
            .insert(completedActionItems)
            .values({
              actionItemId,
              userId: user.id,
            })
            .onConflictDoUpdate({
              target: [
                completedActionItems.actionItemId,
                completedActionItems.userId,
              ],
              set: { actionItemId, userId: user.id },
            })
            .returning();
        } else {
          return await db
            .delete(completedActionItems)
            .where(
              and(
                eq(completedActionItems.actionItemId, actionItemId),
                eq(completedActionItems.userId, user.id)
              )
            )
            .returning();
        }
      }
    ),
});
