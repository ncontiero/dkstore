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
      toast.warn("You have been signed out!");
    },
  });

  const isAuthRoute = useMemo(
    () => authRoutes.some((route) => pathname.startsWith(route)),
    [pathname],
  );

  const refreshSession = useAction(refreshSessionAction, {
    onError: () => {
      signOut.execute({ redirectTo: isAuthRoute ? "/" : pathname });
    },
  });

  useEffect(() => {
    if (session === null) return;
    refreshSession.execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <SessionContext.Provider value={props}>{children}</SessionContext.Provider>
  );
}
