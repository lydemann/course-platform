import { initTRPC } from '@trpc/server';
import { z } from 'zod';

describe('tRPC input validation with Zod', () => {
  const resolve = jest.fn((input) => input);
  const t = initTRPC.create();
  const caller = t
    .router({
      validate: t.procedure
        .input(
          z.object({
            lessonId: z.string(),
            isCompleted: z.boolean().optional(),
            resources: z.array(z.enum(['WORKSHEET', 'CHEATSHEET', 'OTHER'])),
          }),
        )
        .query(({ input }) => resolve(input)),
    })
    .createCaller({});

  beforeEach(() => resolve.mockClear());

  it('accepts the schema constructs used by the course routers', async () => {
    const input = { lessonId: 'lesson-1', resources: ['WORKSHEET' as const] };
    await expect(caller.validate(input)).resolves.toEqual(input);
    expect(resolve).toHaveBeenCalledWith(input);
  });

  it('rejects invalid input as BAD_REQUEST before reaching the resolver', async () => {
    await expect(
      caller.validate({ lessonId: 123, resources: ['INVALID'] } as never),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' });
    expect(resolve).not.toHaveBeenCalled();
  });
});
