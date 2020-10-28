import { DocumentReference } from '@angular/fire/firestore';

export interface SectionDTO {
  id: string;
  name: string;
  theme: String;
  lessons: DocumentReference[];
}
