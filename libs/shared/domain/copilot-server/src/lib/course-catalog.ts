import { and, eq, ilike, or } from 'drizzle-orm';
import { db, schema } from '@course-platform/shared/domain/trpc-server/drizzle';

/**
 * Read-only course lookups backing the student assistant's tools.
 *
 * Every function takes the authenticated `userId` explicitly: the assistant
 * runs outside tRPC, so it does not inherit `protectedProcedure`'s guard and
 * must not be handed a query path that skips it.
 */

export interface CourseSummary {
  id: string;
  name: string;
  description: string;
}

export async function listCourses(): Promise<CourseSummary[]> {
  const courses = await db.query.courses.findMany();
  return courses.map(({ id, name, description }) => ({
    id,
    name,
    description,
  }));
}

/**
 * Full section/lesson tree for one course, annotated with what this student has
 * already completed so the assistant can answer "what should I do next?".
 */
export async function getCourseOutline(userId: string, courseId: string) {
  const [course, sections, completedLessons] = await Promise.all([
    db.query.courses.findFirst({
      where: eq(schema.courses.id, courseId),
    }),
    db.query.sections.findMany({
      where: eq(schema.sections.courseId, courseId),
      orderBy: (section, { asc }) => [asc(section.name)],
      with: {
        lessons: {
          orderBy: (lesson, { asc }) => [asc(lesson.orderId)],
        },
      },
    }),
    db.query.completedLessons.findMany({
      where: eq(schema.completedLessons.userId, userId),
    }),
  ]);

  if (!course) {
    return null;
  }

  const completedLessonIds = new Set(
    completedLessons.map((completed) => completed.lessonId),
  );

  return {
    id: course.id,
    name: course.name,
    description: course.description,
    sections: sections.map((section) => ({
      id: section.id,
      name: section.name,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        name: lesson.name,
        description: lesson.description,
        orderId: lesson.orderId,
        isCompleted: completedLessonIds.has(lesson.id),
      })),
    })),
  };
}

/**
 * Free-text search across lesson names, lesson descriptions and resource names.
 *
 * The catalog is small enough that a LIKE scan is the right tool here — there is
 * no embedding index and none is needed at this size.
 */
export async function searchLessons(
  userId: string,
  query: string,
  courseId?: string,
) {
  const term = `%${query}%`;

  const matchingLessons = await db.query.lessons.findMany({
    where: or(
      ilike(schema.lessons.name, term),
      ilike(schema.lessons.description, term),
    ),
    limit: 20,
    with: {
      section: true,
      resources: true,
    },
  });

  const matchingResources = await db.query.resources.findMany({
    where: or(
      ilike(schema.resources.name, term),
      ilike(schema.resources.description, term),
    ),
    limit: 20,
    with: {
      lesson: {
        with: { section: true },
      },
    },
  });

  const byLessonId = new Map<
    string,
    {
      lessonId: string;
      lessonName: string;
      lessonDescription: string;
      sectionId: string;
      sectionName: string;
      courseId: string;
      matchedOn: string[];
    }
  >();

  const add = (
    lesson: { id: string; name: string; description: string },
    section: { id: string; name: string; courseId: string } | null,
    matchedOn: string,
  ) => {
    if (!section) return;
    if (courseId && section.courseId !== courseId) return;

    const existing = byLessonId.get(lesson.id);
    if (existing) {
      if (!existing.matchedOn.includes(matchedOn)) {
        existing.matchedOn.push(matchedOn);
      }
      return;
    }

    byLessonId.set(lesson.id, {
      lessonId: lesson.id,
      lessonName: lesson.name,
      lessonDescription: lesson.description,
      sectionId: section.id,
      sectionName: section.name,
      courseId: section.courseId,
      matchedOn: [matchedOn],
    });
  };

  for (const lesson of matchingLessons) {
    add(lesson, lesson.section, 'lesson');
  }
  for (const resource of matchingResources) {
    if (resource.lesson) {
      add(resource.lesson, resource.lesson.section, 'resource');
    }
  }

  const completedLessons = await db.query.completedLessons.findMany({
    where: eq(schema.completedLessons.userId, userId),
  });
  const completedLessonIds = new Set(
    completedLessons.map((completed) => completed.lessonId),
  );

  return [...byLessonId.values()].map((result) => ({
    ...result,
    isCompleted: completedLessonIds.has(result.lessonId),
  }));
}

/** One lesson with its resources, for "tell me more about X". */
export async function getLesson(userId: string, lessonId: string) {
  const lesson = await db.query.lessons.findFirst({
    where: eq(schema.lessons.id, lessonId),
    with: {
      section: true,
      resources: true,
    },
  });

  if (!lesson) {
    return null;
  }

  const completed = await db.query.completedLessons.findFirst({
    where: and(
      eq(schema.completedLessons.userId, userId),
      eq(schema.completedLessons.lessonId, lessonId),
    ),
  });

  return {
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    isCompleted: !!completed,
    sectionId: lesson.section?.id ?? null,
    sectionName: lesson.section?.name ?? null,
    courseId: lesson.section?.courseId ?? null,
    resources: lesson.resources.map((resource) => ({
      id: resource.id,
      name: resource.name,
      url: resource.url,
      type: resource.type,
      description: resource.description,
    })),
  };
}

/**
 * Marks one lesson complete or incomplete for this student.
 *
 * The only write the assistant can perform. Mirrors `lessonRouter.setCompleted`,
 * including its upsert, so the two paths cannot drift. `userId` is bound by the
 * caller from the verified JWT and is never a model-supplied argument, so a
 * student can only ever change their own progress.
 *
 * Returns null when the lesson id does not exist, so the tool can say so rather
 * than silently reporting success.
 */
export async function setLessonCompleted(
  userId: string,
  lessonId: string,
  isCompleted: boolean,
) {
  const lesson = await db.query.lessons.findFirst({
    where: eq(schema.lessons.id, lessonId),
    columns: { id: true, name: true },
  });

  if (!lesson) {
    return null;
  }

  if (isCompleted) {
    await db
      .insert(schema.completedLessons)
      .values({ lessonId, userId })
      .onConflictDoUpdate({
        target: [
          schema.completedLessons.lessonId,
          schema.completedLessons.userId,
        ],
        set: { lessonId, userId },
      });
  } else {
    await db
      .delete(schema.completedLessons)
      .where(
        and(
          eq(schema.completedLessons.lessonId, lessonId),
          eq(schema.completedLessons.userId, userId),
        ),
      );
  }

  return { lessonId: lesson.id, lessonName: lesson.name, isCompleted };
}
