"use client";

import { LogOut } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { DropdownMenuItem } from "@/components/ui/DropdownMenu";

export function SignOutButton() {
  const pathname = usePathname();
  const signOut = useAction(signOutAction);

  return (
    <DropdownMenuItem asChild className="w-full p-2">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2"
        onClick={() => signOut.execute({ redirectTo: pathname })}
      >
        <LogOut className="size-4" />
        Sign Out
      </button>
    </DropdownMenuItem>
  );
}
