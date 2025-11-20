const mockUsersWithAddress = [
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
];

export const getUsersCount = jest.fn().mockResolvedValue(100);

export const getUsersWithAddressLeftJoin = jest
  .fn()
  .mockResolvedValue(mockUsersWithAddress);
