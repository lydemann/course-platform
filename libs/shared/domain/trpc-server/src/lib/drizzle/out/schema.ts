import { relations, sql } from 'drizzle-orm';
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';

import { Guid } from 'guid-typescript';

export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  customStyling: jsonb('custom_styling'),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  sections: many(sections),
}));

export const lessons = pgTable('lessons', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => Guid.create().toString()),
  name: text('name').notNull(),
  videoUrl: text('video_url').notNull(),
  description: text('description').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  orderId: integer('order_id').notNull(),
  sectionId: text('section_id')
    .notNull()
    .references(() => sections.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  section: one(sections, {
    fields: [lessons.sectionId],
    references: [sections.id],
  }),
  resources: many(resources),
}));

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
    username: text('username'),
    full_name: text('full_name'),
    avatar_url: text('avatar_url'),
    website: text('website'),
  },
  (table) => {
    return {
      profiles_username_key: unique('profiles_username_key').on(table.username),
    };
  }
);

export const completedLessons = pgTable(
  'completed_lessons',
  {
    lessonId: text('lesson_id')
      .notNull()
      .references(() => lessons.id),
    userId: text('user_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({ unq: unique().on(t.lessonId, t.userId) })
);

export const resources = pgTable('resources', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const resourcesRelations = relations(resources, ({ one }) => ({
  lesson: one(lessons, {
    fields: [resources.lessonId],
    references: [lessons.id],
  }),
}));

export const sections = pgTable('sections', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => Guid.create().toString()),
  name: text('name').notNull(),
  theme: text('theme').notNull(),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sectionsRelations = relations(sections, ({ many, one }) => ({
  lessons: many(lessons),
  course: one(courses),
}));

export const completedActionItems = pgTable(
  'completed_action_items',
  {
    actionItemId: text('action_item_id').notNull(),
    userId: text('user_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({ unq: unique().on(t.actionItemId, t.userId) })
);

export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id').primaryKey().notNull(),
    role: text('role').notNull(),
  },
  (table) => [
    unique('user_roles_user_id_role_unique').on(table.userId, table.role),
  ]
);
