import { AuthenticationError } from 'apollo-server-express';

import { LessonResource } from '@course-platform/shared/interfaces';
import { removeEmptyFields } from '@course-platform/shared/util';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';
import { SectionDTO } from '../models/section-dto';
import { populateLesson } from '../section/section-resolvers';

interface UpdateLessonInput extends LessonDTO {
  courseId;
}

export const lessonMutationResolvers = {
  createLesson: (
    parent,
    { sectionId, name, description, videoUrl, courseId }: UpdateLessonInput,
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    if (!admin) {
      throw new AuthenticationError('User is not admin');
    }

    const cleanedPayload = removeEmptyFields({
      sectionId,
      name,
      description,
      videoUrl
    });
    const newLessonRef = firestoreDB
      .collection(`schools/${schoolId}/courses/${courseId}/lessons`)
      .doc();
    const createLessonPromise = newLessonRef
      .set({
        ...cleanedPayload,
        id: newLessonRef.id
      } as LessonDTO)
      .then(() => newLessonRef.id);

    const sectionRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
    );
    const updateSectionPromise = sectionRef
      .get()
      .then(snapshot => snapshot.data())
      .then((section: SectionDTO) => {
        const newLessons = [...section.lessons, newLessonRef];
        sectionRef.update({ lessons: newLessons });
      });

    return Promise.all([createLessonPromise, updateSectionPromise]).then(() =>
      newLessonRef.get().then(snapshot => snapshot.data())
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
      resources,
      courseId
    }: UpdateLessonInput,
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    if (!admin) {
      throw new AuthenticationError('User is not admin');
    }
    let resourceReferences: FirebaseFirestore.DocumentReference<
      LessonResource
    >[] = [];
    if (resources) {
      const lessonResourcesRef = firestoreDB.collection(
        `schools/${schoolId}/courses/${courseId}/resources`
      );
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
            .then(() => {
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
      resources: resourceReferences || []
    } as LessonDTO);

    const lessonRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/lessons/${id}`
    );
    return lessonRef
      .update(cleanedPayload)
      .then(data => lessonRef.get().then(lesSnap => lesSnap.data()))
      .then((lesson: LessonDTO) => populateLesson(lesson));
  },
  deleteLesson: async (
    parent,
    {
      sectionId,
      id,
      courseId
    }: { sectionId: string; id: string; courseId: string },
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    if (!admin) {
      throw new AuthenticationError('User is not admin');
    }
    const sectionRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
    );
    const deleteSectionLessonPromise = sectionRef
      .get()
      .then(snapshot => snapshot.data())
      .then((section: SectionDTO) => {
        const newLessons = section.lessons.filter(lesson => lesson.id !== id);
        sectionRef.update({ lessons: newLessons } as SectionDTO);
      });

    const lessonDocRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/lessons/${id}`
    );

    const lessonSnapshot = await lessonDocRef.get();

    const deleteResourcesPromise = lessonSnapshot
      .data()
      .resources?.map(resource => {
        resource.delete();
      });

    const deleteLessonPromise = lessonDocRef.delete();
    await Promise.all([
      deleteLessonPromise,
      deleteSectionLessonPromise,
      deleteResourcesPromise
    ]);

    return 'Lesson deleted';
  }
};
