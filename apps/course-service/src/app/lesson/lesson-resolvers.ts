import { removeEmptyFields } from '@course-platform/shared/util';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';

export const lessonMutationResolvers = {
  createLesson: (
    parent,
    { sectionId, id, name, description, videoUrl }: LessonDTO
  ) => {
    const newLessonRef = firestoreDB.collection('sections').doc();
    // TODO: add lesson ref to section
    return newLessonRef
      .set({
        sectionId,
        id: newLessonRef.id,
        name,
        description,
        videoUrl
      } as LessonDTO)
      .then(data => newLessonRef.id);
  },
  updateLesson: (
    parent,
    { sectionId, id, name, description, videoUrl }: LessonDTO
  ) => {
    const cleanedPayload = removeEmptyFields({
      sectionId,
      id,
      name,
      description,
      videoUrl
    });

    return firestoreDB
      .doc(`lessons/${id}`)
      .update(cleanedPayload)
      .then(() => 'Updated lesson');
  },
  deleteLesson: (
    parent,
    { sectionId, id }: { sectionId: string; id: string }
  ) => {
    return firestoreDB
      .doc(`lessons/${id}`)
      .delete()
      .then(() => 'Deleted lesson');
  }
};
