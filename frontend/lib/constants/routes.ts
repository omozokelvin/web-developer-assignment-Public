export const routes = {
  home: '/',
  usersPosts: (userId: string) => `/posts/?userId=${userId}`,
};
