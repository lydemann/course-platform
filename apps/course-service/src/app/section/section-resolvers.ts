import {
  ActionItem,
  CourseSection,
  Lesson,
  LessonResourceType
} from '@course-platform/shared/interfaces';
import { removeEmptyFields } from '@course-platform/shared/util';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';
import { SectionDTO } from '../models/section-dto';
import { getDefaultActionItems } from './default-action-items';

export const sectionQueryResolvers = {
  courseSections: async (parent, { uid }) => {
    const getUserActionItemsCompletedPromise = () =>
      firestoreDB
        .doc(`users/${uid}`)
        .collection('actionItemsCompleted')
        .where('isCompleted', '==', true)
        .select('id')
        .get()
        .then(snap => {
          return snap.docs.map(doc => {
            return doc.data()?.id;
          });
        });

    const completedActionItemsPromise = uid
      ? getUserActionItemsCompletedPromise()
      : Promise.resolve<string[]>([]);

    const sectionsPromise = firestoreDB
      .collection('sections')
      .orderBy('name')
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data()) as SectionDTO[];
      });

    return Promise.all([sectionsPromise, completedActionItemsPromise]).then(
      async ([sections, completedActionItems]) => {
        const lessonsPerSections = sections.map(section => {
          return section.lessons.map(lesson =>
            lesson
              .get()
              .then(lessonRef => populateLesson(lessonRef.data() as LessonDTO))
          );
        });

        return lessonsPerSections.map(async (lessonsPerSectionPromise, idx) => {
          const lessons = await Promise.all(lessonsPerSectionPromise);
          const section = sections[idx];
          const userCompletedActionItemsSet = new Set(completedActionItems);
          const actionItems = lessons.reduce(
            (prev: ActionItem[], lesson) => [
              ...prev,
              ...(lesson.resources || [])
                .filter(
                  resource =>
                    resource.type === LessonResourceType.WorkSheet &&
                    !prev.find(
                      prevActionItem => prevActionItem.id === resource.id
                    )
                )
                .map(resource => {
                  return {
                    ...resource,
                    question: `Have you completed the worksheet from lesson "${lesson.name}" called: "${resource.name}"?`,
                    isCompleted: userCompletedActionItemsSet.has(resource.id)
                  } as ActionItem;
                })
            ],
            [...getDefaultActionItems(section.id, userCompletedActionItemsSet)]
          );
          return {
            ...section,
            lessons,
            actionItems
          } as CourseSection;
        });
      }
    );
  }
};

const populateLesson = (lesson: LessonDTO): Promise<Lesson> => {
  const resourcesPerLessonProm = (lesson.resources || []).map(resource =>
    resource.get().then(doc => doc.data())
  );

  return Promise.all(resourcesPerLessonProm).then(
    resources =>
      ({
        ...lesson,
        resources
      } as Lesson)
  );
};

export const sectionMutationResolvers = {
  createSection: (parent, { name, theme }: SectionDTO) => {
    const newSectionRef = firestoreDB.collection('sections').doc();
    return newSectionRef
      .set({ id: newSectionRef.id, name, theme, lessons: [] } as SectionDTO)
      .then(data => newSectionRef.id);
  },
  updateSection: (parent, { id, name, theme }: SectionDTO) => {
    const cleanedPayload = removeEmptyFields({ name, theme } as SectionDTO);
    return firestoreDB
      .doc(`sections/${id}`)
      .update(cleanedPayload)
      .then(() => 'Updated section');
  },
  deleteSection: (parent, { id }: { id: string }) => {
    return firestoreDB
      .doc(`sections/${id}`)
      .delete()
      .then(() => 'Deleted section');
  }
};
