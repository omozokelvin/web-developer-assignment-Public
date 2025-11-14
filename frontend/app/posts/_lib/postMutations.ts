import { Post } from '@/app/posts/_lib/postTypes';
import { httpService } from '@/lib/constants/http';
import { queryKeys } from '@/lib/constants/queryKeys';
import { HttpErrorResponse } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Pick<Post, 'title' | 'body'> & { userId: string }) =>
      httpService.post<HttpErrorResponse, Post>('/posts', body),
    onSuccess: (post) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersPosts(post.user_id),
      });

      toast.success('Post created successfully');
    },
  });
};

export const useDeletePost = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      httpService.delete<HttpErrorResponse, void>(`/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.usersPosts(userId),
      });

      toast.success('Post deleted successfully');
    },
  });
};
