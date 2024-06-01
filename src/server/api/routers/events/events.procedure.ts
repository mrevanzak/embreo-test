import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const eventsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany();
  }),
});
