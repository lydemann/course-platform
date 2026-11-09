import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './out/schema';

describe('course content relations', () => {
  const db = drizzle.mock({ schema });

  it('compiles the nested course outline used by MCP and content search', () => {
    const query = db.query.courses.findMany({
      with: {
        sections: {
          with: { lessons: { with: { resources: true } } },
        },
      },
    });

    expect(query.toSQL().sql).toContain('"courses_sections"."course_id"');
  });

  it('compiles a lesson with its parent section and course', () => {
    const query = db.query.lessons.findFirst({
      with: { section: { with: { course: true } }, resources: true },
    });

    expect(query.toSQL().sql).toContain('"lessons_section"."course_id"');
  });
});
