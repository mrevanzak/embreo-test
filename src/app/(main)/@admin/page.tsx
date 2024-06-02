import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { api } from '@/trpc/server';

import { Table } from '../@hr/table';

export default async function Admin() {
  const data = await api.proposedEvents.get();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposed Events</CardTitle>
        <CardDescription>Proposed events by your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <Table initialData={data} />
      </CardContent>
    </Card>
  );
}
