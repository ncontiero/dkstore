"use client";

import type { User } from "@/utils/types";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

type UserContextType = {
  user: User | null;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
  user,
}: PropsWithChildren<{ readonly user: UserContextType["user"] }>) {
  const props = useMemo(() => ({ user }), [user]);

  return <UserContext.Provider value={props}>{children}</UserContext.Provider>;
}
