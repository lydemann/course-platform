const { gql } = require('apollo-server-express');

export const Sectionschema = gql`
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
    lessons: [Lesson]
  }
`;
