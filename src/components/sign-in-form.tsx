'use client';

import { toast } from 'sonner';

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { signIn } from '@/server/actions/auth';
import { authSchema } from '@/server/api/routers/auth/auth.input';

export function SignInForm() {
  const form = useForm({
    schema: authSchema,
    mode: 'onTouched',
  });
  const onSubmit = form.handleSubmit(async ({ email, password }) => {
    toast.promise(signIn(email, password), {
      loading: 'Signing in...',
      success: 'Signed in successfully',
      error: (e: Error) => 'Failed to sign in: ' + e.message,
    });
  });

  return (
    <Card className='mx-auto w-full max-w-sm'>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardHeader>
            <CardTitle className='text-2xl'>Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className='w-full' type='submit'>
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
