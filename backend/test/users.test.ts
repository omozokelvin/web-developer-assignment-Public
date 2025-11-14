import request from 'supertest';
import app from '../src/app';
import {
  getUsersCount,
  getUsersWithAddressLeftJoin,
} from '../src/db/users/users';

jest.mock('../src/db/users/users');

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
      state: 'MC',
      zipcode: '10001',
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
        address_state: 'MC',
        address_zipcode: '10001',
      },
    ]);

    const response = await request(app).get('/users');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUsers);
    expect(getUsersWithAddressLeftJoin).toHaveBeenCalledWith(1, 4);
  });

  it('should return 400 for invalid page number', async () => {
    const response = await request(app).get('/users?pageNumber=0');
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid page number or page size');
  });

  it('should call DB with specified query parameters', async () => {
    (getUsersWithAddressLeftJoin as jest.Mock).mockClear();

    const response = await request(app).get('/users?pageNumber=2&pageSize=10');
    expect(response.statusCode).toBe(200);
    expect(getUsersWithAddressLeftJoin).toHaveBeenCalledWith(2, 10);
  });
});

describe('GET /users/count', () => {
  it('should return the total count of users', async () => {
    (getUsersCount as jest.Mock).mockResolvedValue(123);

    const response = await request(app).get('/users/count');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ count: 123 });
    expect(getUsersCount).toHaveBeenCalledTimes(1);
  });
});
