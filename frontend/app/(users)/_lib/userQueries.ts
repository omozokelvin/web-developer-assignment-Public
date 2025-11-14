import { User } from '@/app/(users)/_lib/userTypes';
import { httpService } from '@/lib/constants/http';
import { queryKeys } from '@/lib/constants/queryKeys';
import { HttpErrorResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useGetUsers = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: queryKeys.users(pageNumber, pageSize),
    queryFn: () =>
      httpService.get<HttpErrorResponse, User[]>('/users', {
        params: { pageNumber, pageSize },
      }),
  });
};

export const useGetUsersCount = () => {
  return useQuery({
    queryKey: queryKeys.usersCount(),
    queryFn: () =>
      httpService.get<HttpErrorResponse, { count: number }>('/users/count'),
  });
};
