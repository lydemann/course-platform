import { DocumentReference } from '@angular/fire/firestore';

export interface LessonDTO {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  resources: DocumentReference[];
  sectionId?: string;
}
