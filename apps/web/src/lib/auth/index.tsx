"use client";

import type { User } from "@/utils/types";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { authRoutes, protectedRoutes } from "./routes";

type UserContextType = {
  user: User | null;
  lastOtpVerifiedAt?: Date;
  setLastOtpVerifiedAt: (date: Date) => void;
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
  const [lastOtpVerifiedAt, setLastOtpVerifiedAt] = useState<Date | undefined>(
    undefined,
  );
  const props = useMemo(
    () => ({ user, lastOtpVerifiedAt, setLastOtpVerifiedAt }),
    [lastOtpVerifiedAt, user],
  );
  const pathname = usePathname();

  const signOut = useAction(signOutAction, {
    onSuccess: () => {
      toast.warn("You have been signed out");
    },
  });

  const isProtectedRoute = useMemo(
    () => protectedRoutes.some((route) => pathname.startsWith(route)),
    [pathname],
  );
  const isAuthRoute = useMemo(
    () => authRoutes.some((route) => pathname.startsWith(route)),
    [pathname],
  );

  useEffect(() => {
    if (isProtectedRoute && !user) {
      signOut.execute({ redirectTo: isAuthRoute ? "/" : pathname });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthRoute, isProtectedRoute, user]);

  return <UserContext.Provider value={props}>{children}</UserContext.Provider>;
}
