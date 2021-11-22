import { AuthenticationError } from 'apollo-server-express';

import { CourseSectionDTO } from '@course-platform/shared/data-access';
import {
  ActionItem,
  CourseSection,
  Lesson,
  LessonResourceType,
} from '@course-platform/shared/interfaces';
import { removeEmptyFields } from '@course-platform/shared/util';
import { createResolver } from '../../utils/create-resolver';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';
import { SectionDTO } from '../models/section-dto';
import { getDefaultActionItems } from './default-action-items';

interface GetCourseSectionsInput {
  uid: string;
  courseId: string;
  sectionIds: string[];
}

export const sectionQueryResolvers = {
  courseSections: createResolver<GetCourseSectionsInput>(
    (
      parent,
      { uid, courseId, sectionIds },
      { auth: { schoolId } }: RequestContext,
      info
    ) => {
      const getUserActionItemsCompletedPromise = () =>
        firestoreDB
          .doc(`schools/${schoolId}/users/${uid}`)
          .collection('actionItemsCompleted')
          .where('isCompleted', '==', true)
          .select('id')
          .get()
          .then((snap) => {
            return snap.docs.map((doc) => {
              return doc.data()?.id;
            });
          });

      const completedActionItemsPromise = uid
        ? getUserActionItemsCompletedPromise()
        : Promise.resolve<string[]>([]);

      let sectionsPromise: Promise<SectionDTO[]>;
      if (!!sectionIds?.length) {
        sectionsPromise = Promise.all(
          sectionIds.map((sectionId) =>
            firestoreDB
              .doc(
                `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
              )
              .get()
              .then((data) => {
                return data.data() as SectionDTO;
              })
          )
        );
      } else {
        sectionsPromise = firestoreDB
          .collection(`schools/${schoolId}/courses/${courseId}/sections`)
          .orderBy('name')
          .get()
          .then((data) => {
            return data.docs.map((doc) => doc.data()) as SectionDTO[];
          });
      }

      return Promise.all([sectionsPromise, completedActionItemsPromise]).then(
        async ([sections, completedActionItems]) => {
          const lessonsPerSections = sections.map((section) => {
            return section.lessons.map((lesson) =>
              lesson
                .get()
                .then((lessonRef) =>
                  populateLesson(lessonRef.data() as LessonDTO)
                )
            );
          });

          return lessonsPerSections.map(
            async (lessonsPerSectionPromise, idx) => {
              const lessons = await Promise.all(lessonsPerSectionPromise);
              const section = sections[idx];
              const userCompletedActionItemsSet = new Set(completedActionItems);
              const actionItems = lessons.reduce(
                (prev: ActionItem[], lesson) => [
                  ...prev,
                  ...(lesson.resources || [])
                    .filter(
                      (resource) =>
                        resource.type === LessonResourceType.WorkSheet &&
                        !prev.find(
                          (prevActionItem) => prevActionItem.id === resource.id
                        )
                    )
                    .map((resource) => {
                      return {
                        ...resource,
                        question: `Have you completed the worksheet from lesson "${lesson.name}" called: "${resource.name}"?`,
                        isCompleted: userCompletedActionItemsSet.has(
                          resource.id
                        ),
                      } as ActionItem;
                    }),
                ],
                [
                  ...getDefaultActionItems(
                    section.id,
                    userCompletedActionItemsSet
                  ),
                ]
              );
              return {
                ...section,
                lessons,
                actionItems,
              } as CourseSection;
            }
          );
        }
      );
    }
  ),
};

export const populateLesson = (lesson: LessonDTO): Promise<Lesson> => {
  const resourcesPerLessonProm = (lesson.resources || []).map((resource) =>
    resource.get().then((doc) => doc.data())
  );

  return Promise.all(resourcesPerLessonProm).then((resources) => {
    return {
      ...lesson,
      resources: resources.filter((resource) => !!resource),
    } as Lesson;
  });
};

interface UpdateSectionInput extends SectionDTO {
  courseId: string;
}

export const sectionMutationResolvers = {
  createSection: (
    parent,
    { name, courseId }: UpdateSectionInput,
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    if (!admin) {
      throw new AuthenticationError('User is not admin');
    }

    const newSectionRef = firestoreDB
      .collection(`schools/${schoolId}/courses/${courseId}/sections`)
      .doc();
    return newSectionRef
      .set({ id: newSectionRef.id, name, lessons: [] } as SectionDTO)
      .then((data) => newSectionRef.id);
  },

  updateSection: (
    parent,
    { id, name, theme, courseId }: UpdateSectionInput,
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    if (!admin) {
      throw new AuthenticationError('User is not admin');
    }

    const cleanedPayload = removeEmptyFields({ name, theme } as SectionDTO);
    return firestoreDB
      .doc(`schools/${schoolId}/courses/${courseId}/sections/${id}`)
      .update(cleanedPayload)
      .then(() => 'Updated section');
  },
  deleteSection: (
    parent,
    { id, courseId },
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    if (!admin) {
      throw new AuthenticationError('User is not admin');
    }
    // TODO: delete lessons of section
    return firestoreDB
      .doc(`schools/${schoolId}/courses/${courseId}/sections/${id}`)
      .delete()
      .then(() => 'Deleted section');
  },
  moveLesson: async (
    _,
    { sectionId, courseId, previousIndex, currentIndex },
    { auth: { admin, schoolId } }: RequestContext
  ) => {
    const sectionDoc = firestoreDB.doc(
      `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
    );
    const sectionSnap = await sectionDoc.get();
    const section = sectionSnap.data() as CourseSectionDTO;

    const reorderedLessons = swapInArray(
      section.lessons,
      previousIndex,
      currentIndex
    );
    const updatedSection = {
      ...section,
      lessons: reorderedLessons,
    } as CourseSectionDTO;

    await sectionDoc.update(updatedSection);
    return 'Reordered lessons';
  },
};

function swapInArray(arr: any[], i1: number, i2: number) {
  const clonedArray = [...arr];
  const t = clonedArray[i1];
  clonedArray[i1] = clonedArray[i2];
  clonedArray[i2] = t;
  return clonedArray;
}
