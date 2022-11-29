import { gql } from 'apollo-server-express';

export const SectionSchema = gql`
  type Section {
    id: ID
    name: String
    theme: String
    lessons: [Lesson]
    actionItems: [ActionItem]
  }
`;

export const sectionMutations = `
  createSection(name: String!, courseId: ID!): String
  updateSection(id: ID!, courseId: ID!, name: String theme: String): String
  deleteSection(id: ID!, courseId: ID!): String
  moveLesson(sectionId: ID!, previousIndex: Int!, currentIndex: Int!, courseId: ID!): String
`;
