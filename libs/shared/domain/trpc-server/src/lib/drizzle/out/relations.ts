import { relations } from 'drizzle-orm/relations';
import {
  courses,
  sections,
  lessons,
  completedLessons,
  resources,
  userRoles,
  profiles,
} from './schema';

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  course: one(courses, {
    fields: [sections.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  sections: many(sections),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  section: one(sections, {
    fields: [lessons.sectionId],
    references: [sections.id],
  }),
  completed_lessons: many(completedLessons),
  resources: many(resources),
}));

export const completed_lessonsRelations = relations(
  completedLessons,
  ({ one }) => ({
    lesson: one(lessons, {
      fields: [completedLessons.lessonId],
      references: [lessons.id],
    }),
  })
);

export const resourcesRelations = relations(resources, ({ one }) => ({
  lesson: one(lessons, {
    fields: [resources.lessonId],
    references: [lessons.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  usersInAuth: one(userRoles, {
    fields: [profiles.id],
    references: [userRoles.userId],
  }),
}));

export const usersInAuthRelations = relations(userRoles, ({ many }) => ({
  profiles: many(profiles),
}));
