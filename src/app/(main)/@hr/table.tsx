'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye, Trash } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';

import type { EventProposal } from '@/server/db/schema';
import { api } from '@/trpc/react';

type EventProposalDataTable = EventProposal & { proposedByCompany: string };

export function Table({
  initialData,
}: {
  initialData: EventProposalDataTable[];
}) {
  const utils = api.useUtils();
  const { data } = api.proposedEvents.get.useQuery(undefined, { initialData });
  const { mutate, isPending } = api.proposedEvents.delete.useMutation({
    onSuccess: () => {
      void utils.proposedEvents.get.invalidate();
    },
  });

  const columns: ColumnDef<EventProposalDataTable>[] = [
    {
      accessorKey: 'proposedByCompany',
      header: 'Proposed By',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <div className='flex items-center justify-end gap-1'>
            <Button size='icon' variant='ghost'>
              <Eye className='size-4' />
              <span className='sr-only'>View</span>
            </Button>

            <ResponsiveDialog
              title='Delete Event'
              description={`Are you sure you want to delete "${row.original.eventId}"?`}
              trigger={
                <Button
                  size='icon'
                  variant='ghost'
                  className='hover:bg-destructive/60 hover:text-destructive-foreground'
                >
                  <Trash className='size-4' />
                  <span className='sr-only'>Delete</span>
                </Button>
              }
            >
              <Button
                className='w-full'
                onClick={() => mutate({ id: row.original.id })}
                loading={isPending}
              >
                Delete
              </Button>
            </ResponsiveDialog>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
