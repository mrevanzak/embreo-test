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

import { EventProposalForm } from './form';
import { Table } from './table';

export default async function HR() {
  const data = await api.proposedEvents.get();

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          Proposed Events
          <ResponsiveDialog
            id='add-event-proposal'
            title='Add Event Proposal'
            description='Propose your new wellness event'
            trigger={
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Add
                </span>
              </Button>
            }
          >
            <EventProposalForm />
          </ResponsiveDialog>
        </CardTitle>
        <CardDescription>Propose your new wellness event</CardDescription>
      </CardHeader>
      <CardContent>
        <Table initialData={data} />
      </CardContent>
    </Card>
  );
}
