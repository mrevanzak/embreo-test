import { Navbar } from '@/components/navbar';

export default function AuthenticatedLayout(props: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className='min-h-[calc(100vh-4rem)]'>{props.children}</main>
    </>
  );
}
