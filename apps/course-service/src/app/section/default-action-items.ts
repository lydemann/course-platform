import { ActionItem } from '@course-platform/shared/interfaces';

export const getDefaultActionItems = (
  sectionId: string,
  userCompletedActionItemsSet: Set<string>
): ActionItem[] => [
  {
    id: `${sectionId}-1`,
    question: "Have you viewed all of the week's videos in full?",
    answerDescription: 'Simple yes/no question.',
    isCompleted: userCompletedActionItemsSet.has(`${sectionId}-1`)
  },
  {
    id: `${sectionId}-2`,
    question: 'Have you reached out for help in Slack when in need?',
    answerDescription: 'Simple yes/no question.',
    isCompleted: userCompletedActionItemsSet.has(`${sectionId}-2`)
  },
  {
    id: `${sectionId}-3`,
    question: 'How are you feeling after completing week one?',
    answerDescription:
      "Provide a simple one-two sentence answer in Slack and let us know how you're feeling as you progress and what you got out of the week's lessons.",
    isCompleted: userCompletedActionItemsSet.has(`${sectionId}-3`)
  }
];
