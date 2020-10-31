import { ActionItem } from '@course-platform/shared/interfaces';

export const getDefaultActionItems = (sectionId: string): ActionItem[] => [
  {
    id: `${sectionId}-1`,
    question: "1. Have you viewed all of the week's videos in full?",
    answerDescription: 'Simple yes/no question.'
  },
  {
    id: `${sectionId}-2`,
    question: '2. Have you reached out for help in Slack when in need?',
    answerDescription: 'Simple yes/no question.'
  },
  {
    id: `${sectionId}-3`,
    question: '3. How are you feeling after completing week one?',
    answerDescription:
      "Provide a simple one-two sentence answer to let us know how you're feeling as you progress."
  }
];
