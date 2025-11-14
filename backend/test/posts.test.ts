import request from 'supertest';
import app from '../src/app';
import { createPost, deletePost, getPosts } from '../src/db/posts/posts';
import { HttpStatus } from '../src/lib/types';

jest.mock('../src/db/posts/posts');

beforeEach(() => {
  jest.clearAllMocks();
});

const mockPost = {
  id: 'post-1',
  user_id: 'user-1',
  title: 'Test Post',
  body: 'This is the test body.',
  created_at: new Date().toISOString(),
};

describe('POST /posts', () => {
  it('should create a new post and return 201', async () => {
    (createPost as jest.Mock).mockResolvedValue(mockPost);
    const newPost = { userId: 'user-1', title: 'New Title', body: 'New Body' };

    const response = await request(app).post('/posts').send(newPost);

    expect(response.statusCode).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual(mockPost);
    expect(createPost).toHaveBeenCalledWith({
      user_id: newPost.userId,
      title: newPost.title,
      body: newPost.body,
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/posts')
      .send({ userId: 'user-1', title: 'Title Only' });

    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.error).toBe('userId, title, and body are required');
    expect(createPost).not.toHaveBeenCalled();
  });

  it('should return 500 if the database call fails', async () => {
    (createPost as jest.Mock).mockRejectedValue(new Error('DB Error'));

    const response = await request(app)
      .post('/posts')
      .send({ userId: 'user-1', title: 'Valid Title', body: 'Valid Body' });

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.error).toBe(
      'An error occurred while creating the post'
    );
  });
});

describe('GET /posts', () => {
  it('should return 400 if userId is missing', async () => {
    const response = await request(app).get('/posts');
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.error).toBe('userId is required');
  });

  it('should return posts for a given userId', async () => {
    (getPosts as jest.Mock).mockResolvedValue([mockPost]);
    const response = await request(app).get('/posts?userId=user-1');

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual([mockPost]);
    expect(getPosts).toHaveBeenCalledWith('user-1');
  });
});

describe('DELETE /posts/:id', () => {
  it('should return 200 on successful deletion', async () => {
    (deletePost as jest.Mock).mockResolvedValue(1); // 1 row changed
    const response = await request(app).delete('/posts/post-to-delete');

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toBe(true);
    expect(deletePost).toHaveBeenCalledWith('post-to-delete');
  });

  it('should return 404 if post is not found (0 changes)', async () => {
    (deletePost as jest.Mock).mockResolvedValue(0); // 0 rows changed
    const response = await request(app).delete('/posts/non-existent-id');

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.error).toBe('Post not found');
  });

  it('should return 500 if the database call fails', async () => {
    (deletePost as jest.Mock).mockRejectedValue(new Error('DB Delete Error'));
    const response = await request(app).delete('/posts/some-id');

    expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.error).toBe(
      'An error occurred while deleting the post'
    );
  });
});
