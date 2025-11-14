export const queryKeys = {
  users: (page: number, size: number) => ['users', page, size] as const,
  usersCount: () => ['usersCount'] as const,
  usersPosts: (userId: string) => ['userPosts', userId] as const,
};
