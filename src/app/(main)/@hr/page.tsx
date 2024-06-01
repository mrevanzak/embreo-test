import { PlusCircle } from 'lucide-react';

import { EventProposalForm } from '@/components/event-proposal-form';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function HR() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex justify-between'>
          Proposed Events
          <ResponsiveDialog
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
        {/* <DataTable columns={columns} data={data} /> */}
      </CardContent>
      <CardFooter>
        <div className='text-xs text-muted-foreground'>
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
