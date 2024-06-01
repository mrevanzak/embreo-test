'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Input } from '@/components/ui/input';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <form className='ml-auto flex-1 sm:flex-initial'>
      <div className='relative'>
        <Input
          type='search'
          placeholder='Search...'
          className='sm:w-[300px] md:w-[200px] lg:w-[300px]'
          onChange={(e) => {
            router.push(
              pathname + '?' + createQueryString('q', e.target.value),
            );
          }}
        />
      </div>
    </form>
  );
}
