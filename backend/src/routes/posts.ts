import { Router, Request, Response } from 'express';
import { createPost, deletePost, getPosts } from '../db/posts/posts';
import { HttpError } from '../lib/utils';
import { HttpStatus } from '../lib/types';

const router = Router();

/**
 * @swagger
 * /posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     description: Creates a new post in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - body
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the post.
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *               body:
 *                 type: string
 *                 description: The body content of the post.
 *     responses:
 *       201:
 *         description: The post was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Missing required fields (userId, title, or body).
 *       500:
 *         description: An error occurred while creating the post.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, title, body } = req.body;

    if (!userId || !title || !body) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        'userId, title, and body are required'
      );
    }

    const newPost = await createPost({ user_id: userId, title, body });

    res.status(HttpStatus.CREATED).send(newPost);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).send({ error: error.message });
      return;
    }

    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 'An error occurred while creating the post' });
  }
});

/**
 * @swagger
 * /posts:
 *   get:
 *     tags: [Posts]
 *     summary: Retrieve a list of posts by user ID
 *     description: Retrieve a list of posts from the database for a given user ID.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve posts for.
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The post ID.
 *                     example: d3a4ec91a50447ebb64e395e124caf40
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who created the post.
 *                     example: d3a4ec91a50447ebb64e395e124caf40
 *                   title:
 *                     type: string
 *                     description: The title of the post.
 *                     example: My first post
 *                   body:
 *                     type: string
 *                     description: The body of the post.
 *                     example: This is the body of my first post.
 *                   created_at:
 *                     type: date
 *                     description: The date the post was created.
 *                     example: 2024-01-24T12:45:32+02:00.
 *       400:
 *         description: userId is required.
 */
router.get('/', async (req: Request, res: Response) => {
  const userId = req.query.userId?.toString();
  if (!userId) {
    res.status(HttpStatus.BAD_REQUEST).send({ error: 'userId is required' });
    return;
  }
  const posts = await getPosts(userId);
  res.send(posts);
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post by ID
 *     description: Deletes a single post from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete.
 *     responses:
 *       204:
 *         description: The post was successfully deleted.
 *       404:
 *         description: The post was not found.
 *       500:
 *         description: An error occurred while deleting the post.
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const changes = await deletePost(id);
    if (changes === 0) {
      res.status(HttpStatus.NOT_FOUND).send({ error: 'Post not found' });
      return;
    }
    res.status(HttpStatus.OK).send(true);
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 'An error occurred while deleting the post' });
  }
});

export default router;
