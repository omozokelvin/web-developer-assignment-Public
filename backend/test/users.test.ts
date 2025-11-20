import request from 'supertest';
import app from '../src/app';
import {
  getUsersCount,
  getUsersWithAddressLeftJoin,
  getUserWithAddressById,
} from '../src/db/users/users';
import { HttpStatus } from '../src/lib/types';

jest.mock('../src/db/users/users');

describe('GET /users/:id', () => {
  it('should return a user with address if found', async () => {
    (getUserWithAddressById as jest.Mock).mockResolvedValue({
      id: 'user-1',
      name: 'Test User 1',
      username: 'test1',
      email: 'test1@example.com',
      phone: '123-456-7890',
      address_id: 'addr-1',
      address_street: '123 Mock St',
      address_city: 'Mock City',
      address_state: 'CA',
      address_zipcode: '10001',
    });

    const response = await request(app).get('/users/user-1');
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      id: 'user-1',
      name: 'Test User 1',
      username: 'test1',
      email: 'test1@example.com',
      phone: '123-456-7890',
      address: {
        id: 'addr-1',
        street: '123 Mock St',
        city: 'Mock City',
        state: 'CA',
        zipcode: '10001',
        friendly_address: '123 Mock St, Mock City, California, 10001',
      },
    });
    expect(getUserWithAddressById).toHaveBeenCalledWith('user-1');
  });

  it('should return 404 if user not found', async () => {
    (getUserWithAddressById as jest.Mock).mockResolvedValue(undefined);
    const response = await request(app).get('/users/does-not-exist');
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe('User not found');
  });
});

const mockUsers = [
  {
    id: 'user-1',
    name: 'Test User 1',
    username: 'test1',
    email: 'test1@example.com',
    phone: '123-456-7890',
    address: {
      id: 'addr-1',
      street: '123 Mock St',
      city: 'Mock City',
      state: 'CA',
      zipcode: '10001',
      friendly_address: '123 Mock St, Mock City, California, 10001',
    },
  },
];

describe('GET /users', () => {
  it('should return a list of users with default pagination', async () => {
    (getUsersWithAddressLeftJoin as jest.Mock).mockResolvedValue([
      {
        id: 'user-1',
        name: 'Test User 1',
        username: 'test1',
        email: 'test1@example.com',
        phone: '123-456-7890',
        address_id: 'addr-1',
        address_street: '123 Mock St',
        address_city: 'Mock City',
        address_state: 'CA',
        address_zipcode: '10001',
      },
    ]);

    const response = await request(app).get('/users');

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual(mockUsers);
    expect(getUsersWithAddressLeftJoin).toHaveBeenCalledWith(1, 4);
  });

  it('should return 400 for invalid page number', async () => {
    const response = await request(app).get('/users?pageNumber=0');
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('Invalid page number or page size');
  });

  it('should call DB with specified query parameters', async () => {
    (getUsersWithAddressLeftJoin as jest.Mock).mockClear();

    const response = await request(app).get('/users?pageNumber=2&pageSize=10');
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(getUsersWithAddressLeftJoin).toHaveBeenCalledWith(2, 10);
  });
});

describe('GET /users/count', () => {
  it('should return the total count of users', async () => {
    (getUsersCount as jest.Mock).mockResolvedValue(123);

    const response = await request(app).get('/users/count');

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual({ count: 123 });
    expect(getUsersCount).toHaveBeenCalledTimes(1);
  });
});
