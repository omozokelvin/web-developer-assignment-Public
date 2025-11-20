export const routes = {
  home: (pageNumber?: number) => `/?pageNumber=${pageNumber || 1}`,
  usersPosts: (userId: string) => `/posts/?userId=${userId}`,
};
