import { removeEmptyFields } from '@course-platform/shared/util';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';
import { SectionDTO } from '../models/section-dto';

export const lessonMutationResolvers = {
  createLesson: (
    parent,
    { sectionId, name, description, videoUrl }: LessonDTO
  ) => {
    const cleanedPayload = removeEmptyFields({
      sectionId,
      name,
      description,
      videoUrl
    });
    const newLessonRef = firestoreDB.collection('lessons').doc();
    const createLessonPromise = newLessonRef
      .set({
        id: newLessonRef.id,
        ...cleanedPayload
      } as LessonDTO)
      .then(data => newLessonRef.id);

    const sectionRef = firestoreDB.doc(`sections/${sectionId}`);
    const updateSectionPromise = sectionRef
      .get()
      .then(snapshot => snapshot.data())
      .then((section: SectionDTO) => {
        const newLessons = [...section.lessons, newLessonRef];
        sectionRef.update({ lessons: newLessons });
      });

    return Promise.all([createLessonPromise, updateSectionPromise]).then(
      () => newLessonRef.id
    );
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
    const deleteLessonPromise = firestoreDB.doc(`lessons/${id}`).delete();

    const sectionRef = firestoreDB.doc(`sections/${sectionId}`);
    const deleteSectionLessonPromise = sectionRef
      .get()
      .then(snapshot => snapshot.data())
      .then((section: SectionDTO) => {
        const newLessons = section.lessons.filter(lesson => lesson.id !== id);
        sectionRef.update({ lessons: newLessons } as SectionDTO);
      });

    return Promise.all([deleteLessonPromise, deleteSectionLessonPromise]).then(
      () => 'Lesson deleted'
    );
  }
};
