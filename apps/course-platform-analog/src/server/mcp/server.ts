import {
  McpServer,
  createMcpHandler,
  fromJsonSchema,
  type CallToolResult,
} from '@modelcontextprotocol/server';
import {
  getCourseContentOutline,
  getCourseLessonContent,
  listCourseContent,
  searchStoredCourseContent,
} from '@course-platform/shared/domain/trpc-server';

import { getVimeoTranscript } from './vimeo-transcript';

const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

// Kept in tool metadata for hosts that use per-tool auth declarations. The
// entire HTTP endpoint also requires a validated Supabase bearer token.
const oauthToolMetadata = {
  securitySchemes: [{ type: 'oauth2', scopes: [] }],
};

const courseIdSchema = fromJsonSchema<{ courseId: string }>({
  type: 'object',
  properties: {
    courseId: {
      type: 'string',
      description: 'Course identifier returned by list_courses.',
    },
  },
  required: ['courseId'],
  additionalProperties: false,
});

const searchSchema = fromJsonSchema<{
  query: string;
  courseId?: string;
  limit?: number;
}>({
  type: 'object',
  properties: {
    query: {
      type: 'string',
      minLength: 1,
      description: 'Words or phrase to find in stored course content.',
    },
    courseId: {
      type: 'string',
      description: 'Optional course identifier to restrict the search.',
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 50,
      default: 20,
    },
  },
  required: ['query'],
  additionalProperties: false,
});

const lessonSchema = fromJsonSchema<{
  lessonId: string;
  transcriptLanguage?: string;
  maxTranscriptCharacters?: number;
}>({
  type: 'object',
  properties: {
    lessonId: {
      type: 'string',
      description: 'Lesson identifier returned by get_course_outline.',
    },
    transcriptLanguage: {
      type: 'string',
      description:
        'Optional Vimeo text-track language code or display name. The active track is used by default.',
    },
    maxTranscriptCharacters: {
      type: 'integer',
      minimum: 1_000,
      maximum: 100_000,
      default: 50_000,
      description: 'Maximum transcript characters returned in one response.',
    },
  },
  required: ['lessonId'],
  additionalProperties: false,
});

export const courseContentMcpHandler = createMcpHandler(
  () => {
    const server = new McpServer({
      name: 'angular-course-content',
      version: '1.0.0',
    });

    server.registerTool(
      'list_courses',
      {
        title: 'List Angular courses',
        description:
          'List the courses available to the authenticated course-portal student.',
        annotations: readOnlyAnnotations,
        _meta: oauthToolMetadata,
      },
      async () => toolResult({ courses: await listCourseContent() }),
    );

    server.registerTool(
      'get_course_outline',
      {
        title: 'Get course outline',
        description:
          'Get a course with its ordered lessons and lesson resources. Use list_courses first to discover course IDs.',
        inputSchema: courseIdSchema,
        annotations: readOnlyAnnotations,
        _meta: oauthToolMetadata,
      },
      async ({ courseId }) => {
        const course = await getCourseContentOutline(courseId);
        return course
          ? toolResult({ course })
          : toolError(`No course exists with id "${courseId}".`);
      },
    );

    server.registerTool(
      'search_course_content',
      {
        title: 'Search course content',
        description:
          'Search course, lesson, section, and resource titles/descriptions. Use get_lesson_content to read a matching lesson transcript.',
        inputSchema: searchSchema,
        annotations: readOnlyAnnotations,
        _meta: oauthToolMetadata,
      },
      async ({ query, courseId, limit }) =>
        toolResult({
          query,
          results: await searchStoredCourseContent(query, {
            courseId,
            limit,
          }),
        }),
    );

    server.registerTool(
      'get_lesson_content',
      {
        title: 'Get lesson content and transcript',
        description:
          'Get one lesson, its resources, and the matching Vimeo transcript when a text track is available.',
        inputSchema: lessonSchema,
        annotations: readOnlyAnnotations,
        _meta: oauthToolMetadata,
      },
      async ({ lessonId, transcriptLanguage, maxTranscriptCharacters }) => {
        const lesson = await getCourseLessonContent(lessonId);
        if (!lesson) {
          return toolError(`No lesson exists with id "${lessonId}".`);
        }

        let transcript;
        try {
          transcript = await getVimeoTranscript(lesson.videoUrl, {
            language: transcriptLanguage,
            maxCharacters: maxTranscriptCharacters,
          });
        } catch (error) {
          console.error('Unexpected Vimeo transcript error', error);
          transcript = {
            status: 'unavailable' as const,
            reason: 'Vimeo transcript retrieval failed unexpectedly.',
          };
        }

        return toolResult({ lesson, transcript });
      },
    );

    return server;
  },
  {
    responseMode: 'json',
    onerror: (error) => console.error('MCP request failed', error),
  },
);

function toolResult(value: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
  };
}

function toolError(message: string): CallToolResult {
  return {
    content: [{ type: 'text', text: message }],
    isError: true,
  };
}
