'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import moment from 'moment';

import { cn } from '@/lib/utils';

import { DataTable } from '@/components/data-table';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { EventProposal } from '@/server/db/schema';
import { api } from '@/trpc/react';

import { EventProposalForm } from './form';

export type EventProposalDataTable = EventProposal & {
  event: string;
  handledBy: string;
  proposedBy: string;
};

export function Table({
  initialData,
}: {
  initialData: EventProposalDataTable[];
}) {
  const { data, isFetching } = api.proposedEvents.get.useQuery(undefined, {
    initialData,
  });

  const columns: ColumnDef<EventProposalDataTable>[] = [
    {
      accessorKey: 'event',
      header: 'Event',
    },
    {
      accessorKey: 'handledBy',
      header: 'Handled By',
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <Badge variant='outline' className='min-w-max'>
          {moment(row.original.approvedDate ?? row.original.date).format('LL')}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        switch (row.original.status) {
          case 'approved':
            return <Badge>Approved</Badge>;
          case 'rejected':
            return <Badge variant='destructive'>Rejected</Badge>;
          default:
            return <Badge variant='secondary'>Pending</Badge>;
        }
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <Badge variant='outline' className='min-w-max'>
          {moment(row.original.createdAt).fromNow()}
        </Badge>
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
              <EventProposalForm values={row.original} details />
            </ResponsiveDialog>
          </div>
        );
      },
    },
  ];

  return <DataTable loading={isFetching} columns={columns} data={data} />;
}
