import { LessonResourceType } from '@course-platform/shared/interfaces';

export interface LessonDTO {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: LessonResourcePayload[];
  sectionId?: string;
}

export interface LessonResourcePayload {
  id?: string;
  name: string;
  url: string;
  type: LessonResourceType;
}

export interface UpdateLessonPayload {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: LessonResourcePayload[];
  sectionId?: string;
}
