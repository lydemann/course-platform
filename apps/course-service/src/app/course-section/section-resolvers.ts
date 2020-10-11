import { DocumentReference } from '@angular/fire/firestore';

import { Lesson } from '@course-platform/shared/interfaces';
import { firestoreDB } from '../firestore';

export interface CourseSectionDTO {
  id: string;
  name: string;
  lessons: DocumentReference[];
}

export interface LessonDTO {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: DocumentReference[];
  // set by client
  isCompleted?: boolean;
}

export const sectionResolvers = {
  courseSections: (parent, { lessonsToPopulate }) =>
    firestoreDB
      .collection('sections')
      .get()
      .then(data => {
        return data.docs.map(doc => doc.data());
      })
      .then(sections => {
        const promises = [];
        const lessonsPerSectionPromise: Promise<
          Lesson[]
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
      } as Lesson)
  );
};
