'use client';

import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
      <div className='relative'>
        <input
          type={type === 'password' ? (isVisible ? 'text' : 'password') : type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === 'password' && (
          <button
            className='absolute right-2.5 top-2.5 focus:outline-none'
            type='button'
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <EyeOff className='pointer-events-none size-5' />
            ) : (
              <Eye className='pointer-events-none size-5' />
            )}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
