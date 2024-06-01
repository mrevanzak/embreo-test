import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function Admin() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposed Events</CardTitle>
        <CardDescription>Proposed events by your clients</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <DataTable columns={columns} data={data} /> */}
      </CardContent>
    </Card>
  );
}
