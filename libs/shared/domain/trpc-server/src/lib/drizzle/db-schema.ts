import { is, relations } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: text('id').primaryKey(),
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
  // get completed lessons and use lesson id and userId to check if the lesson is completed
}));

const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  // array of completed lessons
  // array of completed action items
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const completedLessons = pgTable(
  'completed_lessons',
  {
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({ unq: unique().on(t.lessonId, t.userId) })
);

export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lessonId: uuid('lesson_id')
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
  courseId: text('course_id')
    .notNull()
    .references(() => courses.id),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sectionsRelations = relations(sections, ({ many }) => ({
  lessons: many(lessons),
  actionItems: many(actionItems),
}));

export const actionItems = pgTable('action_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answerDescription: text('answer_description'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sectionId: uuid('section_id').references(() => sections.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
});

export const completedActionItems = pgTable(
  'completed_action_items',
  {
    actionItemId: uuid('action_item_id')
      .notNull()
      .references(() => actionItems.id),
    userId: uuid('user_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({ unq: unique().on(t.actionItemId, t.userId) })
);
