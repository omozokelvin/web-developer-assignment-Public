import { randomUUID } from 'crypto';
import { connection } from '../connection';
import {
  deletePostTemplate,
  insertPostTemplate,
  selectPostByIdTemplate,
  selectPostsTemplate,
} from './query-tamplates';
import { Post } from './types';

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all(selectPostsTemplate, [userId], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results as Post[]);
    });
  });

export const deletePost = (postId: string): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.run(deletePostTemplate, [postId], function (error) {
      if (error) {
        reject(error);
      }
      resolve(this.changes);
    });
  });

export const createPost = (
  post: Omit<Post, 'id' | 'created_at'>
): Promise<Post> => {
  const postId = randomUUID();
  const createdAt = new Date().toISOString();

  return new Promise((resolve, reject) => {
    connection.run(
      insertPostTemplate,
      [postId, post.user_id, post.title, post.body, createdAt],
      function (error) {
        if (error) {
          return reject(error);
        }

        connection.get(
          selectPostByIdTemplate,
          [postId],
          (selectError, createdPost: Post) => {
            if (selectError) {
              return reject(selectError);
            }

            resolve(createdPost);
          }
        );
      }
    );
  });
};
