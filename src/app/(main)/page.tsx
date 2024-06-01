import { File, ListFilter, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { api } from '@/trpc/server';
import { AddEventProposalDialog } from '@/components/add-event-proposal-dialog';

export default async function Dashboard() {
  const data = await api.proposedEvents.get();

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8'>
      <div className='flex items-center'>
        <div className='ml-auto flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 gap-1'>
                <ListFilter className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size='sm' variant='outline' className='h-8 gap-1'>
            <File className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Export
            </span>
          </Button>

          <AddEventProposalDialog
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
          />
        </div>
      </div>
      <Card x-chunk='dashboard-06-chunk-0'>
        <CardHeader>
          <CardTitle>Proposed Events</CardTitle>
          <CardDescription>Manage your proposed events here</CardDescription>
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
    </main>
  );
}
