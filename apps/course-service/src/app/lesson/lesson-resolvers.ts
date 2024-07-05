import { AuthenticationError } from 'apollo-server-express';

import { CourseSectionDTO } from '@course-platform/shared/domain';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';

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

    const cleanedPayload = {
      id: new Date().getTime().toString(),
      sectionId,
      name,
      description: description || '',
      videoUrl: videoUrl || '',
      resources: [],
    } as LessonDTO;

    const sectionRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
    );
    const updateSectionPromise = sectionRef
      .get()
      .then((snapshot) => snapshot.data())
      .then((section: CourseSectionDTO) => {
        const newLessons = [...(section.lessons || []), cleanedPayload];
        sectionRef.update({ lessons: newLessons });
      });

    return updateSectionPromise.then(() => cleanedPayload);
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
      courseId,
    }: UpdateLessonInput,
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    if (!admin) {
      throw new AuthenticationError('User is not admin');
    }
    const lessonToUpdate = {
      sectionId,
      id,
      name,
      description: description || '',
      videoUrl: videoUrl || '',
      resources: resources || [],
    } as LessonDTO;

    const sectionRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
    );

    const section = (await sectionRef.get()).data();
    section.lessons = section.lessons.map((lesson) =>
      lesson.id === id ? lessonToUpdate : lesson
    );
    await sectionRef.update(section);
    return lessonToUpdate;
  },
  deleteLesson: async (
    parent,
    {
      sectionId,
      id,
      courseId,
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
      .then((snapshot) => snapshot.data())
      .then((section: CourseSectionDTO) => {
        const newLessons = section.lessons.filter((lesson) => lesson.id !== id);
        sectionRef.update({ lessons: newLessons });
      });

    await deleteSectionLessonPromise;

    return 'Lesson deleted';
  },
};
