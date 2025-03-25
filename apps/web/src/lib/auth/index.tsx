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
import { refreshSessionAction } from "@/actions/account";
import { signOutAction } from "@/actions/auth";
import { authRoutes } from "./routes";

interface SessionContextType {
  session: SessionWhitUser | null;
}

const SessionContext = createContext<SessionContextType>({ session: null });

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

interface SessionProviderProps extends PropsWithChildren {
  readonly session: SessionWhitUser | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  const pathname = usePathname();
  const isAuthRoute = useMemo(
    () => authRoutes.some((route) => pathname.startsWith(route)),
    [pathname],
  );
  const props = useMemo(() => ({ session }), [session]);

  const signOut = useAction(signOutAction, {
    onSuccess: () => {
      toast.warn("You have been signed out!");
    },
    onError: () => {
      toast.error("Sign out failed!");
    },
  });

  const refreshSession = useAction(refreshSessionAction, {
    onError: ({ error }) => {
      toast.error(`Session refresh failed: ${error.serverError}`);
      signOut.execute({ redirectTo: isAuthRoute ? "/" : pathname });
    },
  });

  useEffect(() => {
    refreshSession.execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <SessionContext.Provider value={props}>{children}</SessionContext.Provider>
  );
}
