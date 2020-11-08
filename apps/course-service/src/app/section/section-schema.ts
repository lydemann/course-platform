const { gql } = require('apollo-server-express');

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
  createSection(name: String!): String
  updateSection(id: ID! name: String theme: String): String
  deleteSection(id: ID!): String
`;
