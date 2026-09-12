import { asc, eq } from 'drizzle-orm';

import { db } from '../drizzle/db';
import * as schema from '../drizzle/out/schema';

export interface CourseSummary {
  id: string;
  name: string;
  description: string;
}

export interface LessonResource {
  id: string;
  name: string;
  description: string | null;
  type: string;
  url: string;
}

export interface CourseLesson {
  id: string;
  name: string;
  description: string;
  orderId: number;
  videoUrl: string;
  resources: LessonResource[];
}

export interface CourseSectionOutline {
  id: string;
  name: string;
  theme: string;
  lessons: CourseLesson[];
}

export interface CourseOutline extends CourseSummary {
  sections: CourseSectionOutline[];
}

export interface LessonContent extends CourseLesson {
  course: CourseSummary;
  section: {
    id: string;
    name: string;
  };
}

export interface CourseContentSearchResult {
  kind: 'course' | 'lesson' | 'resource';
  title: string;
  description: string | null;
  courseId: string;
  sectionId?: string;
  lessonId?: string;
  resourceUrl?: string;
}

const courseColumns = {
  id: true,
  name: true,
  description: true,
} as const;

const resourceColumns = {
  id: true,
  name: true,
  description: true,
  type: true,
  url: true,
} as const;

export async function listCourseContent(): Promise<CourseSummary[]> {
  return db.query.courses.findMany({
    columns: courseColumns,
    orderBy: [asc(schema.courses.name)],
  });
}

export async function getCourseContentOutline(
  courseId: string,
): Promise<CourseOutline | null> {
  const course = await db.query.courses.findFirst({
    columns: courseColumns,
    where: eq(schema.courses.id, courseId),
    with: {
      sections: {
        columns: {
          id: true,
          name: true,
          theme: true,
        },
        orderBy: [asc(schema.sections.name)],
        with: {
          lessons: {
            columns: {
              id: true,
              name: true,
              description: true,
              orderId: true,
              videoUrl: true,
            },
            orderBy: [asc(schema.lessons.orderId)],
            with: {
              resources: {
                columns: resourceColumns,
                orderBy: [asc(schema.resources.name)],
              },
            },
          },
        },
      },
    },
  });

  return course ?? null;
}

export async function getCourseLessonContent(
  lessonId: string,
): Promise<LessonContent | null> {
  const lesson = await db.query.lessons.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      orderId: true,
      videoUrl: true,
    },
    where: eq(schema.lessons.id, lessonId),
    with: {
      resources: {
        columns: resourceColumns,
        orderBy: [asc(schema.resources.name)],
      },
      section: {
        columns: {
          id: true,
          name: true,
        },
        with: {
          course: {
            columns: courseColumns,
          },
        },
      },
    },
  });

  if (!lesson || !lesson.section.course) {
    return null;
  }

  return {
    id: lesson.id,
    name: lesson.name,
    description: lesson.description,
    orderId: lesson.orderId,
    videoUrl: lesson.videoUrl,
    resources: lesson.resources,
    section: {
      id: lesson.section.id,
      name: lesson.section.name,
    },
    course: lesson.section.course,
  };
}

export async function searchStoredCourseContent(
  query: string,
  options: { courseId?: string; limit?: number } = {},
): Promise<CourseContentSearchResult[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const courses = await db.query.courses.findMany({
    columns: courseColumns,
    ...(options.courseId
      ? { where: eq(schema.courses.id, options.courseId) }
      : {}),
    orderBy: [asc(schema.courses.name)],
    with: {
      sections: {
        columns: {
          id: true,
          name: true,
        },
        orderBy: [asc(schema.sections.name)],
        with: {
          lessons: {
            columns: {
              id: true,
              name: true,
              description: true,
            },
            orderBy: [asc(schema.lessons.orderId)],
            with: {
              resources: {
                columns: resourceColumns,
                orderBy: [asc(schema.resources.name)],
              },
            },
          },
        },
      },
    },
  });

  const limit = Math.min(Math.max(options.limit ?? 20, 1), 50);
  const matches: CourseContentSearchResult[] = [];
  const includesQuery = (...values: Array<string | null | undefined>) =>
    values.some((value) =>
      value?.toLocaleLowerCase().includes(normalizedQuery),
    );

  for (const course of courses) {
    if (includesQuery(course.name, course.description)) {
      matches.push({
        kind: 'course',
        title: course.name,
        description: course.description,
        courseId: course.id,
      });
    }

    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (includesQuery(section.name, lesson.name, lesson.description)) {
          matches.push({
            kind: 'lesson',
            title: lesson.name,
            description: lesson.description,
            courseId: course.id,
            sectionId: section.id,
            lessonId: lesson.id,
          });
        }

        for (const resource of lesson.resources) {
          if (
            includesQuery(resource.name, resource.description, resource.type)
          ) {
            matches.push({
              kind: 'resource',
              title: resource.name,
              description: resource.description,
              courseId: course.id,
              sectionId: section.id,
              lessonId: lesson.id,
              resourceUrl: resource.url,
            });
          }
        }

        if (matches.length >= limit) {
          return matches.slice(0, limit);
        }
      }
    }
  }

  return matches.slice(0, limit);
}
