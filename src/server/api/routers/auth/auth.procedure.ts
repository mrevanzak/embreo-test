import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      with: {
        company: true,
      },
    });
  }),
});
