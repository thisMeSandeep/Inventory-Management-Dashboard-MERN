import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { type User } from "../types/user.types";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "UserStore",
    }
  )
);

