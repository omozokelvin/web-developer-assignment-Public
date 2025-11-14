import UsersPage from '@/app/(users)/page';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, Mock } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { useGetUsers, useGetUsersCount } from '@/app/(users)/_lib/userQueries';

const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    address: { city: 'New York', street: '123 Main St' },
  },
  {
    id: 'u2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    address: { city: 'Los Angeles', street: '456 Oak Ave' },
  },
  {
    id: 'u3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    address: { city: 'Chicago', street: '789 Pine Ln' },
  },
  {
    id: 'u4',
    name: 'David Green',
    email: 'david@example.com',
    address: { city: 'Houston', street: '101 Oak St' },
  },
  {
    id: 'u5',
    name: 'Eve White',
    email: 'eve@example.com',
    address: { city: 'Phoenix', street: '202 Pine Ave' },
  },
];

const mockPush = vi.fn();
const mockSetUser = vi.fn();

const mockUseGetUsersCount = useGetUsersCount as Mock;
const mockUseGetUsers = useGetUsers as Mock;

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    route: '/users',
    pathname: '/users',
    query: {},
    asPath: '/users',
    push: mockPush,
  })),
}));

vi.mock('@/app/(users)/_lib/userQueries', () => ({
  useGetUsersCount: vi.fn(),
  useGetUsers: vi.fn(),
}));

vi.mock('@/app/(users)/_lib/userStore', () => ({
  useUserStore: vi.fn(() => ({
    selectSelectedUser: mockSetUser,
  })),
}));

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseGetUsersCount.mockReturnValue({
      data: { count: MOCK_USERS.length },
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    mockUseGetUsers.mockImplementation(
      (pageNumber: number, pageSize: number) => {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return {
          data: MOCK_USERS.slice(startIndex, endIndex),
          isLoading: false,
          isError: false,
          isSuccess: true,
          error: null,
        };
      }
    );
  });

  it('renders with mocked data without crashing', () => {
    render(<UsersPage />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('displays loading state when users are loading', () => {
    // Override the default mock to simulate loading for both queries (or at least the main user list query)
    mockUseGetUsers.mockReturnValue({
      data: [],
      isLoading: true, // Set to true for loading state
      isError: false,
      isSuccess: false,
      error: null,
    });

    // Mock count query to avoid undefined errors if it renders first/separately
    mockUseGetUsersCount.mockReturnValue({
      data: { count: 0 },
      isLoading: true, // Set to true for loading state
      isError: false,
      isSuccess: false,
      error: null,
    });

    render(<UsersPage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays error message when there is an error fetching users', () => {
    const errorMessage = 'Failed to fetch users';
    const error = new Error(errorMessage);

    mockUseGetUsers.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: error,
    });

    mockUseGetUsersCount.mockReturnValue({
      data: { count: 0 },
      isLoading: false,
      isError: true,
      isSuccess: false,
      error: error,
    });

    render(<UsersPage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
