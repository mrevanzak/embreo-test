import { File, ListFilter, PlusCircle } from 'lucide-react';

import { AddEventProposalDialog } from '@/components/add-event-proposal-dialog';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { auth } from '@/server/auth';

export default async function AuthenticatedLayout(props: {
  admin: React.ReactNode;
  hr: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Navbar />
      <main className='min-h-[calc(100vh-4rem)]'>
        <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8'>
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

              {session?.user.role === 'company_hr' && (
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
              )}
            </div>
          </div>
          {session?.user.role === 'company_hr' ? props.hr : props.admin}
        </div>
      </main>
    </>
  );
}
