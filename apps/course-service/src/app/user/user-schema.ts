const { gql } = require('apollo-server-express');

export const UserSchema = gql`
  type CompletedLesson {
    lessonId: String
    completed: Boolean
    time: String
  }

  type UserInfo {
    completedLessons: [CompletedLesson]
  }
`;
