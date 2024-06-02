import { type SQL, and, desc, eq } from 'drizzle-orm';

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/server/api/trpc';
import {
  companies,
  eventProposals,
  events,
  insertEventProposalSchema,
  selectEventProposalSchema,
} from '@/server/db/schema';

export const proposedEventsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const baseQuery = ctx.db
      .select({
        eventProposals,
        event: events.name,
        company: companies.name,
      })
      .from(eventProposals)
      .innerJoin(companies, eq(eventProposals.proposedBy, companies.id))
      .innerJoin(events, eq(eventProposals.eventId, events.id))
      .orderBy(desc(eventProposals.createdAt));

    const filters: SQL[] = [];
    if (ctx.session.user.role === 'vendor_admin') {
      filters.push(eq(events.handledBy, ctx.session.user.companyId));
    }

    if (ctx.session.user.role === 'company_hr') {
      filters.push(eq(companies.id, ctx.session.user.companyId));
    }

    const query = await baseQuery.where(and(...filters));
    return query.map((row) => ({
      ...row.eventProposals,
      event: row.event,
      proposedBy:
        ctx.session.user.role === 'company_hr'
          ? ctx.session.user.name
          : row.company,
    }));
  }),

  create: protectedProcedure
    .input(insertEventProposalSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(eventProposals).values(input);
    }),

  approve: adminProcedure
    .input(selectEventProposalSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(eventProposals)
        .set({ status: 'approved' })
        .where(eq(eventProposals.id, input.id));
    }),

  delete: protectedProcedure
    .input(selectEventProposalSchema.pick({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(eventProposals)
        .where(eq(eventProposals.id, input.id));
    }),
});
