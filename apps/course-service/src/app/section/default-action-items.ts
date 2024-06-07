import { ActionItem } from '@course-platform/shared/interfaces';

export const getDefaultActionItems = (
  sectionId: string,
  userCompletedActionItemsSet: Set<string>
): ActionItem[] => [
  {
    id: `${sectionId}-1`,
    question: "Have you viewed all of the week's videos in full?",
    answerDescription: 'Simple yes/no question.',
    isCompleted: userCompletedActionItemsSet.has(`${sectionId}-1`),
  },
  {
    id: `${sectionId}-2`,
    question: 'Have you reached out for help in the community when in need?',
    answerDescription: 'Simple yes/no question.',
    isCompleted: userCompletedActionItemsSet.has(`${sectionId}-2`),
  },
  {
    id: `${sectionId}-3`,
    question: 'How are you feeling after completing the week?',
    answerDescription:
      "Provide a simple one-two sentence answer in the community and let us know how you're feeling as you progress and if you have any questions.",
    isCompleted: userCompletedActionItemsSet.has(`${sectionId}-3`),
  },
];
