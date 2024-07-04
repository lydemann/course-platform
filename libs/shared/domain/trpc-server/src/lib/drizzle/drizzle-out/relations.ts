import { relations } from 'drizzle-orm/relations';
import {
  courses,
  sections,
  lessons,
  completed_lessons,
  resources,
  usersInAuth,
  profiles,
} from './schema';

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  course: one(courses, {
    fields: [sections.course_id],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  sections: many(sections),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  section: one(sections, {
    fields: [lessons.section_id],
    references: [sections.id],
  }),
  completed_lessons: many(completed_lessons),
  resources: many(resources),
}));

export const completed_lessonsRelations = relations(
  completed_lessons,
  ({ one }) => ({
    lesson: one(lessons, {
      fields: [completed_lessons.lesson_id],
      references: [lessons.id],
    }),
  })
);

export const resourcesRelations = relations(resources, ({ one }) => ({
  lesson: one(lessons, {
    fields: [resources.lesson_id],
    references: [lessons.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [profiles.id],
    references: [usersInAuth.id],
  }),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  profiles: many(profiles),
}));
