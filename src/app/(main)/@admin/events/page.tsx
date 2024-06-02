import { PlusCircle } from 'lucide-react';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { api } from '@/trpc/server';

import { EventForm } from './form';
import { Table } from './table';

export default async function EventsPage() {
  const data = await api.event.get();

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          Events
          <ResponsiveDialog
            id='add-event'
            title='Add Event'
            description="Add a new event that you're hosting"
            trigger={
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Add
                </span>
              </Button>
            }
          >
            <EventForm />
          </ResponsiveDialog>
        </CardTitle>

        <CardDescription>Manage your events</CardDescription>
      </CardHeader>
      <CardContent>
        <Table initialData={data} />
      </CardContent>
    </Card>
  );
}
