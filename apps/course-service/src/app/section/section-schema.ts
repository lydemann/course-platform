const { gql } = require('apollo-server-express');

export const SectionSchema = gql`
  type LessonResource {
    id: ID
    name: String
    url: String
  }

  type Lesson {
    id: ID
    name: String
    videoUrl: String
    description: String
    resources: [LessonResource]
  }

  type ActionItem {
    id: ID
    question: String
    answerDescription: String
    isCompleted: Boolean
  }

  type Section {
    id: ID
    name: String
    theme: String
    lessons: [Lesson]
    actionItems: [ActionItem]
  }
`;

export const sectionMutations = `
  createSection(name: String!): String
  updateSection(id: ID! name: String theme: String): String
  deleteSection(id: ID!): String
`;
