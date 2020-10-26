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

  type Section {
    id: ID
    name: String
    theme: String
    lessons: [Lesson]
  }
`;

export const sectionMutations = `
  createSection(name: String! theme: String): String
  updateSection(id: ID! name: String theme: String): String
  deleteSection(id: ID!): String
`;
