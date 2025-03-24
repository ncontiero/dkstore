"use client";

import type { SessionWhitUser } from "@/utils/types";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { authRoutes, protectedRoutes } from "./routes";

type SessionContextType = {
  session: SessionWhitUser | null;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

export function SessionProvider({
  children,
  session,
}: PropsWithChildren<{ readonly session: SessionContextType["session"] }>) {
  const props = useMemo(() => ({ session }), [session]);
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
    if (isProtectedRoute && (!session || session.expires < new Date())) {
      signOut.execute({ redirectTo: isAuthRoute ? "/" : pathname });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthRoute, isProtectedRoute, pathname, session]);

  return (
    <SessionContext.Provider value={props}>{children}</SessionContext.Provider>
  );
}
