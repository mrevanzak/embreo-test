'use server';

import { AuthError } from 'next-auth';

import { signInServer, signOutServer } from '@/server/auth';

export async function signIn(email: string, password: string) {
  try {
    await signInServer('credentials', {
      email: email,
      password: password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error(
        error.cause?.err?.message ?? 'Oops! Something went wrong!',
      );
    }
    throw error;
  }
}

export async function signOut() {
  return await signOutServer({ redirectTo: '/sign-in' });
}
