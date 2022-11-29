import { AuthenticationError } from 'apollo-server-express';

import {
  ActionItem,
  CourseSection,
  LessonResourceType,
} from '@course-platform/shared/interfaces';
import { removeEmptyFields } from '@course-platform/shared/util';
import { CourseSectionDTO } from '@course-platform/shared/data-access';
import { createResolver } from '../../utils/create-resolver';
import { RequestContext } from '../auth-identity';
import { firestoreDB } from '../firestore';
import { getDefaultActionItems } from './default-action-items';

interface GetCourseSectionsInput {
  uid: string;
  courseId: string;
  sectionIds: string[];
}

export const sectionQueryResolvers = {
  courseSections: createResolver<GetCourseSectionsInput>(
    async (
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
          .then((snap) => snap.docs.map((doc) => doc.data()?.id));

      const completedActionItemsPromise = uid
        ? getUserActionItemsCompletedPromise()
        : Promise.resolve<string[]>([]);

      let sectionsPromise: Promise<CourseSectionDTO[]>;
      if (sectionIds?.length) {
        sectionsPromise = Promise.all(
          sectionIds.map((sectionId) =>
            firestoreDB
              .doc(
                `schools/${schoolId}/courses/${courseId}/sections/${sectionId}`
              )
              .get()
              .then((data) => data.data() as CourseSectionDTO)
          )
        );
      } else {
        sectionsPromise = firestoreDB
          .collection(`schools/${schoolId}/courses/${courseId}/sections`)
          .orderBy('name')
          .get()
          .then(
            (data) => data.docs.map((doc) => doc.data()) as CourseSectionDTO[]
          );
      }

      sectionsPromise = sectionsPromise.then((sections) =>
        sections.filter((section) => {
          return (section.lessons[0] as any).firestore === undefined;
        })
      );

      const populatedSections = await Promise.all([
        sectionsPromise,
        completedActionItemsPromise,
      ]).then(async ([sections, completedActionItems]) => {
        const lessonsPerSections = sections.map((section) =>
          section.lessons.map((lesson) => lesson)
        );

        return lessonsPerSections.map(async (lessons, idx) => {
          const section = sections[idx];
          const userCompletedActionItemsSet = new Set<string>(
            completedActionItems
          );
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
                .map(
                  (resource) =>
                    ({
                      ...resource,
                      question: `Have you completed the worksheet from lesson "${lesson.name}" called: "${resource.name}"?`,
                      isCompleted: userCompletedActionItemsSet.has(resource.id),
                    } as ActionItem)
                ),
            ],
            [...getDefaultActionItems(section.id, userCompletedActionItemsSet)]
          );
          return {
            ...section,
            lessons,
            actionItems,
          } as CourseSection;
        });
      });

      return populatedSections;
    }
  ),
};

interface UpdateSectionInput extends CourseSectionDTO {
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
      .set({ id: newSectionRef.id, name, lessons: [] } as CourseSectionDTO)
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

    const cleanedPayload = removeEmptyFields({
      name,
      theme,
    } as CourseSectionDTO);
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

    // TODO: test
    await sectionDoc.update(updatedSection as any);
    return 'Reordered lessons';
  },
};

function swapInArray<T>(arr: T[], i1: number, i2: number): T[] {
  const clonedArray = [...arr];
  const t = clonedArray[i1];
  clonedArray[i1] = clonedArray[i2];
  clonedArray[i2] = t;
  return clonedArray;
}
