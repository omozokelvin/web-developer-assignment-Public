'use client';

import Table from '@/lib/components/Table';
import { routes } from '@/lib/constants/routes';
import { useGetUsers, useGetUsersCount } from '@/app/(users)/_lib/userQueries';
import { ExtendedColumnDef } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/app/(users)/_lib/userTypes';

const FULL_NAME_COLUMN_WIDTH = `w-[179px]`;
const EMAIL_COLUMN_WIDTH = `w-[213px] md:w-[226px]`;
const ADDRESS_COLUMN_WIDTH = `w-[213px] md:w-[312px]`;
const pageSize = 4;

const userColumns: ExtendedColumnDef<User>[] = [
  {
    header: 'Full name',
    key: 'name',
    cell: (user) => user.name,
    className: FULL_NAME_COLUMN_WIDTH,
    headerClassName: FULL_NAME_COLUMN_WIDTH,
  },
  {
    header: 'Email address',
    key: 'email',
    cell: (user) => user.email,
    className: EMAIL_COLUMN_WIDTH,
    headerClassName: EMAIL_COLUMN_WIDTH,
  },
  {
    header: 'Address',
    key: 'address',
    cell: (user) => user.address.friendly_address,
    className: ADDRESS_COLUMN_WIDTH,
    headerClassName: ADDRESS_COLUMN_WIDTH,
  },
];

export default function UsersPage() {
  // const [pageNumber, setPageNumber] = useState(1);

  const searchParams = useSearchParams();

  const pageNumber = Number(searchParams.get('pageNumber')) || 1;
  const router = useRouter();

  const navigateToPosts = (user: User) => {
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

  return (
    <Table<User>
      title="Users"
      data={users}
      columns={userColumns}
      isLoading={isLoading}
      onRowClick={navigateToPosts}
      totalPages={totalPages}
      pageNumber={pageNumber}
      setPageNumber={(page: number) => {
        router.push(routes.home(page));
      }}
      isError={isError}
      error={error}
    />
  );
}
