import * as React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
            className='absolute right-2 top-2.5 focus:outline-none'
            type='button'
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <FaEyeSlash className='pointer-events-none text-lg' />
            ) : (
              <FaEye className='pointer-events-none text-lg' />
            )}
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
