'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye, Trash } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';

import { DataTable } from '@/components/data-table';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { Event } from '@/server/db/schema';
import { api } from '@/trpc/react';

export function Table({ initialData }: { initialData: Event[] }) {
  const router = useRouter();

  const utils = api.useUtils();
  const { data } = api.event.get.useQuery(undefined, { initialData });
  const { mutate, isPending } = api.event.delete.useMutation({
    onSettled: async () => {
      await utils.event.get.invalidate();
      router.back();
    },
  });

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        return <Badge>{moment(row.original.createdAt).format('LL')}</Badge>;
      },
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
              id={`delete-event-${row.original.id}`}
              title='Delete Event'
              description={`Are you sure you want to delete "${row.original.name}"?`}
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
