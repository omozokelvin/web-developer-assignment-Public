import { Post } from '@/app/posts/_lib/postTypes';
import { httpService } from '@/lib/constants/http';
import { queryKeys } from '@/lib/constants/queryKeys';
import { HttpErrorResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.usersPosts(userId),
    queryFn: () => {
      if (!userId) {
        return [];
      }

      return httpService.get<HttpErrorResponse, Post[]>('/posts', {
        params: { userId },
      });
    },
  });
};
