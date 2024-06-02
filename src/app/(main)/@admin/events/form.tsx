'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
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

import { insertEventSchema } from '@/server/db/schema';
import { api } from '@/trpc/react';

export function EventForm() {
  const router = useRouter();

  const utils = api.useUtils();
  const { mutate, isPending } = api.event.create.useMutation({
    onSuccess: () => {
      void utils.event.get.invalidate();
      router.back();
    },
  });

  const form = useForm({
    schema: insertEventSchema,
  });
  const onSubmit = form.handleSubmit((input) => mutate(input));

  return (
    <Form {...form}>
      <form className='grid items-start gap-8' onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <FormInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button loading={isPending} type='submit'>
          Save changes
        </Button>
      </form>
    </Form>
  );
}
