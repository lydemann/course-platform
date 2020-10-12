const { gql } = require('apollo-server-express');

export const SectionSchema = gql`
  type LessonResource {
    id: String
    name: String
    url: String
  }

  type Lesson {
    id: String
    name: String
    videoUrl: String
    description: String
    resources: [LessonResource]
  }

  type Section {
    id: String
    name: String
    theme: String
    lessons: [Lesson]
  }
`;

export const sectionMutations = `
  createSection(id: String! name: String! theme: String!): String
  updateSection(id: String! name: String theme: String): String
  deleteSection(id: String!): String
`;
