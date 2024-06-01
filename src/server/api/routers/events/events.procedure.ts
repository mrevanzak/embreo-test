import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/server/api/trpc';
import { events, insertEventSchema } from '@/server/db/schema';

export const eventsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany();
  }),

  get: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.events.findMany({
      where: (event, { eq }) => eq(event.handledBy, ctx.session.user.companyId),
    });
  }),

  create: adminProcedure
    .input(insertEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(events)
        .values({ ...input, handledBy: ctx.session.user.companyId });
    }),
});
