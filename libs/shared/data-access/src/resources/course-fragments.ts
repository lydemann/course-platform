import { gql } from 'apollo-angular';

export const courseFragments = {
  lesson: gql`
    fragment LessonFields on Lesson {
      id
      name
      description
      videoUrl
      resources {
        name
        id
        url
        type
      }
    }
  `
};
