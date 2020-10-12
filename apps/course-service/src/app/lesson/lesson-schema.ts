export const lessonMutations = `
    createLesson(sectionId: String!, id: String!, name: String!, description: String!, videoUrl: String!): String
    updateLesson(id: String!, name: String, description: String, videoUrl: String): String
    deleteLesson(id: String!, sectionId: String!): String
`;
