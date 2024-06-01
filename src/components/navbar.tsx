import { CircleUser, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { signOut } from '@/server/actions/auth';
import { api } from '@/trpc/server';

export async function Navbar() {
  const auth = await api.auth.me();

  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium sm:flex sm:flex-row sm:items-center sm:gap-5 sm:text-sm lg:gap-6'>
        <Link
          href='#'
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
        >
          <HeartHandshake className='h-6 w-6' />
          <span className='sr-only'>Acme Inc</span>
        </Link>
        <Link
          href='#'
          className='text-foreground transition-colors hover:text-foreground'
        >
          Dashboard
        </Link>
        {auth?.role === 'vendor_admin' && (
          <Link
            href='#'
            className='text-foreground transition-colors hover:text-foreground'
          >
            Events
          </Link>
        )}
      </nav>

      <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <SearchBar />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon' className='rounded-full'>
              <CircleUser className='h-5 w-5' />
              <span className='sr-only'>Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>{auth?.company.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='cursor-pointer focus:bg-destructive focus:text-destructive-foreground'>
              <form action={signOut}>
                <button type='submit'>Sign out</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
