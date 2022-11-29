import { AuthenticationError } from 'apollo-server-express';

import { LessonResource } from '@course-platform/shared/interfaces';
import { removeEmptyFields } from '@course-platform/shared/util';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';
import { CourseSectionDTO } from '@course-platform/shared/data-access';

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
      id: new Date().getTime().toString(),
      sectionId,
      name,
      description,
      videoUrl,
    } as LessonDTO);

    const sectionRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
    );
    const updateSectionPromise = sectionRef
      .get()
      .then((snapshot) => snapshot.data())
      .then((section: CourseSectionDTO) => {
        const newLessons = [...section.lessons, cleanedPayload];
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
    const lessonToUpdate = removeEmptyFields({
      sectionId,
      id,
      name,
      description,
      videoUrl,
      resources,
    } as LessonDTO);

    const sectionRef = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
    );

    const section = (await sectionRef.get()).data() as CourseSectionDTO;
    section.lessons = section.lessons.map((lesson) =>
      lesson.id === lessonToUpdate ? lessonToUpdate : lesson
    );
    return sectionRef.update(section);
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
        sectionRef.update({ lessons: newLessons } as CourseSectionDTO);
      });

    await deleteSectionLessonPromise;

    return 'Lesson deleted';
  },
};
