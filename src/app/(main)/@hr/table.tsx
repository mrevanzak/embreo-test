'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye, Trash } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { DataTable } from '@/components/data-table';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { EventProposal } from '@/server/db/schema';
import { api } from '@/trpc/react';

import { EventProposalForm } from './form';

export type EventProposalDataTable = EventProposal & { event: string };

export function Table({
  initialData,
}: {
  initialData: EventProposalDataTable[];
}) {
  const router = useRouter();

  const utils = api.useUtils();
  const { data } = api.proposedEvents.get.useQuery(undefined, { initialData });
  const { mutate, isPending } = api.proposedEvents.delete.useMutation({
    onSuccess: async () => {
      await utils.proposedEvents.get.invalidate();
      router.back();
    },
  });

  const columns: ColumnDef<EventProposalDataTable>[] = [
    {
      accessorKey: 'proposedBy',
      header: 'Proposed By',
    },
    {
      accessorKey: 'event',
      header: 'Event',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <Badge>{moment(row.original.createdAt).fromNow()}</Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const status = () => {
          switch (row.original.status) {
            case 'approved':
              return 'This event has been approved';
            case 'rejected':
              return 'This event has been rejected';
            default:
              return 'Waiting for vendor approval';
          }
        };

        return (
          <div className='flex items-center justify-end gap-1'>
            <ResponsiveDialog
              id={`proposed-event-${row.original.id}`}
              title='Proposed Event'
              description={status()}
              trigger={
                <Button size='icon' variant='ghost'>
                  <Eye
                    className={cn('size-4', {
                      'text-blue-700': row.original.status === 'pending',
                    })}
                  />
                  <span className='sr-only'>View</span>
                </Button>
              }
            >
              <EventProposalForm values={row.original} disabled />
            </ResponsiveDialog>

            <ResponsiveDialog
              id={`delete-proposed-event-${row.original.id}`}
              title='Delete Proposed Event'
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
