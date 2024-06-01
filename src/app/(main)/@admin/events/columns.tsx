'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye, Trash } from 'lucide-react';
import moment from 'moment';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { type Event } from '@/server/db/schema';

export const columns: ColumnDef<Event>[] = [
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
    cell: () => {
      return (
        <div className='flex items-center justify-end gap-1'>
          <Button size='icon' variant='ghost'>
            <Eye className='size-4' />
            <span className='sr-only'>View</span>
          </Button>

          <Button
            size='icon'
            variant='ghost'
            className='hover:bg-destructive/60 hover:text-destructive-foreground'
          >
            <Trash className='size-4' />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      );
    },
  },
];
