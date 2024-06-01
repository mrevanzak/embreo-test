import { Navbar } from '@/components/navbar';

import { auth } from '@/server/auth';

export default async function AuthenticatedLayout(props: {
  admin: React.ReactNode;
  hr: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      <Navbar />
      <main className='min-h-[calc(100vh-4rem)] p-4 sm:px-6'>
        {session?.user.role === 'company_hr' ? props.hr : props.admin}
      </main>
    </>
  );
}
