import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/server/api/trpc';
import { events, insertEventSchema } from '@/server/db/schema';

export const eventsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany();
  }),

  create: adminProcedure
    .input(insertEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(events)
        .values({ ...input, handledBy: ctx.session.user.companyId });
    }),
});
