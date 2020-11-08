import { LessonResource } from '@course-platform/shared/interfaces';
import { removeEmptyFields } from '@course-platform/shared/util';
import { firestoreDB } from '../firestore';
import { LessonDTO, UpdateLessonPayload } from '../models/lesson-dto';
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
  updateLesson: async (
    parent,
    {
      sectionId,
      id,
      name,
      description,
      videoUrl,
      resources
    }: UpdateLessonPayload
  ) => {
    let resourceReferences: FirebaseFirestore.DocumentReference<
      LessonResource
    >[] = [];
    if (resources) {
      const lessonResourcesRef = firestoreDB.collection('lessonResources');
      resourceReferences = await Promise.all(
        resources.map(resource => {
          const doc = resource.id
            ? lessonResourcesRef.doc(resource.id)
            : lessonResourcesRef.doc();
          return doc
            .set({
              ...resource,
              id: doc.id
            })
            .then(value => {
              return doc as FirebaseFirestore.DocumentReference<LessonResource>;
            });
        })
      );
    }

    const cleanedPayload = removeEmptyFields({
      sectionId,
      id,
      name,
      description,
      videoUrl,
      resources: resourceReferences
    } as LessonDTO);

    return firestoreDB
      .doc(`lessons/${id}`)
      .update(cleanedPayload)
      .then(() => 'Updated lesson');
  },
  deleteLesson: async (
    parent,
    { sectionId, id }: { sectionId: string; id: string }
  ) => {
    const sectionRef = firestoreDB.doc(`sections/${sectionId}`);
    const deleteSectionLessonPromise = sectionRef
      .get()
      .then(snapshot => snapshot.data())
      .then((section: SectionDTO) => {
        const newLessons = section.lessons.filter(lesson => lesson.id !== id);
        sectionRef.update({ lessons: newLessons } as SectionDTO);
      });

    const lessonDocRef = firestoreDB.doc(`lessons/${id}`);

    const value = await lessonDocRef.get();

    await value.data().resources.map(resource => resource.delete());

    const deleteLessonPromise = lessonDocRef.delete();
    await Promise.all([deleteLessonPromise, deleteSectionLessonPromise]);

    return 'Lesson deleted';
  }
};
