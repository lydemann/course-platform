import { anthropic } from '@ai-sdk/anthropic';
import { BuiltInAgent, defineTool } from '@copilotkit/runtime/v2';
import { z } from 'zod';
import {
  getCourseOutline,
  getLesson,
  listCourses,
  searchLessons,
  setLessonCompleted,
} from './course-catalog';

/**
 * Claude Sonnet 5 ($2/$10 per MTok) — the middle tier, picked over Haiku 4.5
 * because this assistant chains several tool calls per turn (search → read →
 * answer) and that is where the cheapest tier tends to get sloppy.
 *
 * Thinking and effort below are model-gated. Sonnet 5 supports adaptive thinking
 * and all five effort levels. Haiku 4.5 supports neither and rejects `effort`
 * outright, so dropping back down means deleting `providerOptions` as well as
 * changing this id.
 */
const MODEL_ID = 'claude-sonnet-5';

const SYSTEM_PROMPT = `You are the course assistant for a learning platform. You help students find their way around the courses they are enrolled in.

How to behave:
- Answer from the course data you retrieve with your tools. Never invent a lesson, section, resource or URL.
- If the tools return nothing relevant, say so plainly and suggest what the student could search for instead.
- When the student's message refers to "this lesson", "this section" or "here", use the current-page context you were given rather than asking them to repeat it.
- Prefer naming specific lessons and sections so the student can navigate there. Include the lesson name, not just the id.
- Keep answers short. Two or three sentences plus a list is usually enough.
- You can mark a lesson complete or incomplete for the student, and nothing else. You cannot enrol students or change any course content — say so if asked.
- Only change completion when the student clearly asks you to. Never infer it from them discussing a lesson, and never mark a whole section or week in one go without them naming that intent.
- Before changing completion, make sure you have the right lesson: if their wording could match more than one, name the candidates and ask which they mean.
- After changing it, state plainly which lesson you changed and to what.`;

/**
 * Builds the assistant for one authenticated student.
 *
 * The user id is bound here rather than passed by the model, so no prompt can
 * talk the assistant into reading another student's progress.
 */
export function createCourseAssistantAgent(userId: string) {
  const tools = [
    defineTool({
      name: 'list_courses',
      description:
        'List every course on the platform with its id, name and description. Use this when the student asks what courses exist or you need a courseId.',
      parameters: z.object({}),
      execute: async () => listCourses(),
    }),

    defineTool({
      name: 'get_course_outline',
      description:
        'Get the full section and lesson outline for a course, including which lessons this student has already completed. Use this for questions about course structure, ordering, or what to do next.',
      parameters: z.object({
        courseId: z.string().describe('The id of the course to outline.'),
      }),
      execute: async ({ courseId }) => {
        const outline = await getCourseOutline(userId, courseId);
        return outline ?? { error: `No course found with id "${courseId}".` };
      },
    }),

    defineTool({
      name: 'search_lessons',
      description:
        'Search lessons and their resources by keyword. Use this whenever the student asks where a topic is covered. Returns matching lessons with their section and course.',
      parameters: z.object({
        query: z
          .string()
          .describe(
            'Keyword or phrase to search for, e.g. "signals" or "rxjs".',
          ),
        courseId: z
          .string()
          .optional()
          .describe(
            'Restrict the search to one course. Omit to search everything.',
          ),
      }),
      execute: async ({ query, courseId }) =>
        searchLessons(userId, query, courseId),
    }),

    defineTool({
      name: 'set_lesson_completed',
      description:
        'Mark a lesson complete or incomplete for the student. This writes to their progress, so only call it when they have clearly asked. Resolve the lesson id first with search_lessons or get_course_outline; never guess one.',
      parameters: z.object({
        lessonId: z.string().describe('The id of the lesson to update.'),
        isCompleted: z
          .boolean()
          .describe('true marks it complete, false marks it incomplete.'),
      }),
      execute: async ({ lessonId, isCompleted }) => {
        const result = await setLessonCompleted(userId, lessonId, isCompleted);
        return result ?? { error: `No lesson found with id "${lessonId}".` };
      },
    }),

    defineTool({
      name: 'get_lesson',
      description:
        'Get one lesson in full, including its video URL, downloadable resources and whether this student has completed it.',
      parameters: z.object({
        lessonId: z.string().describe('The id of the lesson.'),
      }),
      execute: async ({ lessonId }) => {
        const lesson = await getLesson(userId, lessonId);
        return lesson ?? { error: `No lesson found with id "${lessonId}".` };
      },
    }),
  ];

  return new BuiltInAgent({
    model: anthropic(MODEL_ID),
    prompt: SYSTEM_PROMPT,
    tools,
    // Default is 1, which would let Claude call a tool but never answer from the
    // result. A search-then-explain turn needs several hops.
    maxSteps: 8,
    providerOptions: {
      anthropic: {
        thinking: { type: 'adaptive' },
        // Effort is the cost dial, and it moves before the model does. 'low' is
        // the cheaper step if lookups stay accurate; raise toward 'high' only if
        // multi-step searches start answering before they have finished looking.
        effort: 'medium',
      },
    },
  });
}
