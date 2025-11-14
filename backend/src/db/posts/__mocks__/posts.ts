const mockPost = {
  id: 'post-1',
  user_id: 'user-1',
  title: 'Mock Title',
  body: 'Mock Body',
  created_at: new Date().toISOString(),
};

export const createPost = jest.fn().mockResolvedValue(mockPost);
export const getPosts = jest.fn().mockResolvedValue([mockPost]);
export const deletePost = jest.fn().mockResolvedValue(1);
