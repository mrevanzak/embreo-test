import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function HR() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposed Events</CardTitle>
        <CardDescription>Propose your new wellness event</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <DataTable columns={columns} data={data} /> */}
      </CardContent>
      <CardFooter>
        <div className='text-xs text-muted-foreground'>
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
