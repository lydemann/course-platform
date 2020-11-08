import { gql } from 'apollo-server-express';

export const lessonQuerySchema = gql`
  type LessonResource {
    id: ID
    name: String
    url: String
    type: String
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

  input LessonResourceInput {
    id: ID
    name: String
    url: String
    type: String
  }
`;

export const lessonMutations = `
    createLesson(sectionId: String!, name: String, description: String, videoUrl: String): String

    updateLesson(id: String!, name: String, description: String, videoUrl: String, resources: [LessonResourceInput]): String
    deleteLesson(id: String!, sectionId: String!): String
`;
