'use client';

import { Card, Title, Text } from '@tremor/react';
import { queryBuilder } from '@/lib/planetscale';
import Search from './search';
import UsersTable from './table';

export const dynamic = 'force-dynamic';

export default function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  // const search = searchParams.q ?? '';
  // const users = await queryBuilder
  //   .selectFrom('users')
  //   .select(['id', 'name', 'username', 'email'])
  //   .where('name', 'like', `%${search}%`)
  //   .execute();

  // const response = await fetch('api/property/predict');

  // const items = await response.json();
  // console.log(items);

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>
        A list of users retrieved from a MySQL database (PlanetScale).
      </Text>
      <Search />
      <Card className="mt-6">{/* <UsersTable users={users} /> */}</Card>
    </main>
  );
}
