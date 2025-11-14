'use client';

import Table from '@/lib/components/Table';
import { routes } from '@/lib/constants/routes';
import { useGetUsers, useGetUsersCount } from '@/app/(users)/_lib/userQueries';
import { useUserStore } from '@/app/(users)/_lib/userStore';
import { ExtendedColumnDef } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/app/(users)/_lib/userTypes';
import { formatAddress } from '@/app/(users)/_lib/userUtils';

const ADDRESS_COLUMN_WIDTH = 'w-[392px]';
const pageSize = 4;

const userColumns: ExtendedColumnDef<User>[] = [
  {
    header: 'Full name',
    key: 'name',
    cell: (user) => user.name,
  },
  {
    header: 'Email address',
    key: 'email',
    cell: (user) => user.email,
  },
  {
    header: 'Address',
    key: 'address',
    cell: (user) => (
      <div
        className="truncate w-full block"
        title={formatAddress(user.address)}
      >
        {formatAddress(user.address)}
      </div>
    ),
    className: ADDRESS_COLUMN_WIDTH,
    headerClassName: ADDRESS_COLUMN_WIDTH,
  },
];

export default function UsersPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const router = useRouter();
  const { selectSelectedUser: setUser } = useUserStore();

  const navigateToPosts = (user: User) => {
    setUser(user);
    router.push(routes.usersPosts(user.id));
  };

  const { data: usersCount, isLoading: isUsersCountLoading } =
    useGetUsersCount();
  const totalRecords = usersCount?.count || 0;

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError,
    error,
  } = useGetUsers(pageNumber, pageSize);

  const totalPages = Math.ceil(totalRecords / pageSize);

  const isLoading = isUsersLoading || isUsersCountLoading;

  useEffect(() => {
    setUser(null);
  }, []);

  return (
    <Table<User>
      title="Users"
      data={users}
      columns={userColumns}
      isLoading={isLoading}
      onRowClick={navigateToPosts}
      totalPages={totalPages}
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      isError={isError}
      error={error}
    />
  );
}
