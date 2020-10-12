import { removeEmptyFields } from '@course-platform/shared/util';
import { firestoreDB } from '../firestore';
import { LessonDTO } from '../models/lesson-dto';
import { SectionDTO } from '../models/section-dto';

export const sectionQueryResolvers = {
  courseSections: (parent, { lessonsToPopulate }) =>
    firestoreDB
      .collection('sections')
      .orderBy('id')
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data());
      })
      .then(sections => {
        const lessonsPerSectionPromise: Promise<
          LessonDTO[]
        >[] = sections.map(section =>
          section.lessons.map(lesson =>
            lesson.get().then(lessonRef => populateLesson(lessonRef.data()))
          )
        );

        return Promise.all(lessonsPerSectionPromise).then(lessonsPerSection => {
          return sections.map((section, idx) => ({
            ...section,
            lessons: lessonsPerSection[idx]
          }));
        });
      })
};

const populateLesson = (lesson: LessonDTO) => {
  const resourcesPerLessonProm = lesson.resources.map(resource =>
    resource.get().then(doc => doc.data())
  );

  return Promise.all(resourcesPerLessonProm).then(
    resources =>
      ({
        ...lesson,
        resources
      } as LessonDTO)
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
