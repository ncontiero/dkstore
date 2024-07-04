"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
import { DropdownMenuItem } from "../ui/DropdownMenu";

export function SignOutBtnItem() {
  const router = useRouter();

  async function handleSignOut() {
    const { ok, content, errorMsg } = await api.get("signOut", {
      throwError: false,
    });
    if (ok) {
      toast.success(content?.message);
      router.refresh();
    } else {
      toast.error(errorMsg);
    }
  }

  return (
    <DropdownMenuItem asChild className="w-full p-2">
      <button type="button" onClick={() => handleSignOut()}>
        <LogOut className="mr-2 size-4" />
        Sign Out
      </button>
    </DropdownMenuItem>
  );
}
