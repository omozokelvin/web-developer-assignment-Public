// Utility to transform user DB row to API shape

import { Router, Request, Response } from 'express';
import {
  getUsersCount,
  getUsersWithAddressLeftJoin,
  getUserWithAddressById,
} from '../db/users/users';
import { HttpStatus } from '../lib/types';
import { transformUserWithAddress } from '../lib/utils';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database with pagination.
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 4
 *         description: The number of users to retrieve per page.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID.
 *                     example: d3a4ec91a50447ebb64e395e124caf40
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                     example: John Doe
 *                   username:
 *                     type: string
 *                     description: The user's username.
 *                     example: CRJFvWA
 *                   email:
 *                     type: string
 *                     description: The user's email.
 *                     example: oQMoMEF@pTWwpsQ.edu
 *                   phone:
 *                     type: string
 *                     description: The user's phone.
 *                     example: 106-725-1483
 *                   address:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The address ID.
 *                         example: c5358841705b44178fc464f51c69e24e
 *                       street:
 *                         type: string
 *                         description: The street name.
 *                         example: 4709 Blagden Terrace Northwest
 *                       city:
 *                         type: string
 *                         description: The city name.
 *                         example: Washington
 *                       state:
 *                         type: string
 *                         description: The state short code.
 *                         example: DC
 *                       zipcode:
 *                         type: string
 *                         description: The ZIP code.
 *                         example: 20011
 *                       friendly_address:
 *                         type: string
 *                         description: The friendly address.
 *                         example: 4709 Blagden Terrace Northwest, Washington, DC, 20011
 *       400:
 *        description: Invalid page number or page size.
 */
router.get('/', async (req: Request, res: Response) => {
  const pageNumberQuery = req.query.pageNumber;
  const pageSizeQuery = req.query.pageSize;

  const pageNumber =
    pageNumberQuery !== undefined ? Number(pageNumberQuery) : 1;
  const pageSize = pageSizeQuery !== undefined ? Number(pageSizeQuery) : 4;

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1
  ) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: 'Invalid page number or page size' });
    return;
  }

  const users = (await getUsersWithAddressLeftJoin(pageNumber, pageSize)).map(
    transformUserWithAddress
  );

  res.send(users);
});

/**
 * @swagger
 * /users/count:
 *   get:
 *     tags: [Users]
 *     summary: Get the total number of users
 *     description: Retrieve the total count of users in the database.
 *     responses:
 *       200:
 *         description: The total number of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: The total number of users.
 *                   example: 100
 */
router.get('/count', async (req: Request, res: Response) => {
  const count = await getUsersCount();
  res.send({ count });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     description: Retrieve a single user by ID, including address info.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: A user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zipcode:
 *                       type: string
 *                     friendly_address:
 *                       type: string
 *       404:
 *         description: User not found.
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  getUserWithAddressById(id)
    .then((user) => {
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' });
        return;
      }
      res.send(transformUserWithAddress(user));
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Internal server error', error: err?.message || err });
    });
});

export default router;
