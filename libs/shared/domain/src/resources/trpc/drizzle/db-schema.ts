import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import { boolean, json, jsonb, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  customStyling: jsonb('custom_styling'),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  videoUrl: text('video_url').notNull(),
  description: text('description').notNull(),
  isCompleted: boolean('is_completed'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sectionId: uuid('section_id')
    .notNull()
    .references(() => sections.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  section: one(sections),
  resources: many(resources),
}));

export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lessonId: text('lesson_id')
    .notNull()
    .references(() => lessons.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
});


export const sections = pgTable('sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  theme: text('theme'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sectionsRelations = relations(lessons, ({ many }) => ({
  lessons: many(lessons),
  actionItems: many(actionItems),
}));

export const actionItems = pgTable('action_items', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  isCompleted: boolean('is_completed').default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sectionId: text('section_id').references(() => sections.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
});
