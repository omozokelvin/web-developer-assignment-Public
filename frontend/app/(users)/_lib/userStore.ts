import { User } from '@/app/(users)/_lib/userTypes';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
  selectedUser: User | null;
  selectSelectedUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      selectedUser: null,
      selectSelectedUser: (user) => set(() => ({ selectedUser: user })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
