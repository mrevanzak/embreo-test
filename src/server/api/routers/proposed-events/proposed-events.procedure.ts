import { type SQL, and, desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

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
    const vendor = alias(companies, 'vendor');
    const baseQuery = ctx.db
      .select({
        eventProposals,
        event: events.name,
        handledBy: vendor.name,
        proposedBy: companies.name,
      })
      .from(eventProposals)
      .innerJoin(events, eq(eventProposals.eventId, events.id))
      .innerJoin(companies, eq(eventProposals.proposedBy, companies.id))
      .innerJoin(vendor, eq(events.handledBy, vendor.id))
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
      handledBy: row.handledBy,
      proposedBy: row.proposedBy,
    }));
  }),

  create: protectedProcedure
    .input(insertEventProposalSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(eventProposals).values(input);
    }),

  approve: adminProcedure
    .input(selectEventProposalSchema.pick({ id: true, approvedDate: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(eventProposals)
        .set({ status: 'approved', approvedDate: input.approvedDate })
        .where(eq(eventProposals.id, input.id));
    }),

  reject: adminProcedure
    .input(selectEventProposalSchema.pick({ id: true, remarks: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(eventProposals)
        .set({ status: 'rejected', remarks: input.remarks })
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
