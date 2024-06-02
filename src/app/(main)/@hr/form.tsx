'use client';

import { CalendarIcon, PlusIcon } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { insertEventProposalSchema } from '@/server/db/schema';
import { api } from '@/trpc/react';

export function EventProposalForm() {
  const [dateCounter, setDateCounter] = useState(1);

  const { data } = api.auth.me.useQuery();
  const events = api.event.get.useQuery();
  const create = api.proposedEvents.create.useMutation();

  const form = useForm({
    schema: insertEventProposalSchema,
    mode: 'onTouched',
    values: {
      proposedBy: data?.company.id ?? '',
    },
  });
  const onSubmit = form.handleSubmit((input) => {
    if (!data?.company.id) {
      return;
    }

    create.mutate({
      ...input,
      proposedBy: data.company.id,
    });
  });

  return (
    <Form {...form}>
      <form className='grid items-start gap-4' onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name='proposedBy'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <FormInput
                  {...field}
                  disabled
                  value={data?.company.name ?? 'Fetching...'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {[...Array(dateCounter).keys()].map((_, i) => (
          <FormField
            key={i}
            control={form.control}
            // @ts-expect-error - TS doesn't like the dynamic key
            name={i > 0 ? `date${i}` : 'date'}
            render={({ field, formState }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='flex justify-between'>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                          formState.errors[field.name] && 'border-destructive',
                        )}
                      >
                        {field.value ? (
                          moment(field.value).format('LL')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {dateCounter < 3 && (
          <div className='flex items-center justify-end'>
            <Button
              size='sm'
              onClick={() => setDateCounter((prev) => prev + 1)}
              type='button'
            >
              Add more <PlusIcon className='ml-2 size-4' />
            </Button>
          </div>
        )}

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <FormInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='eventId'
          render={({ field, formState }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <Select onValueChange={field.onChange} defaultValue=''>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      formState.errors[field.name] && 'border-destructive',
                    )}
                  >
                    <SelectValue placeholder='Select an event' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {events.data ? (
                    events.data.length ? (
                      events.data.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value='nothing'>
                        No events found
                      </SelectItem>
                    )
                  ) : (
                    <SelectItem disabled value='loading'>
                      Loading...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' loading={create.isPending}>
          Save changes
        </Button>
      </form>
    </Form>
  );
}
