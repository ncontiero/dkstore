import type { User as UserProps } from "@/utils/types";
import { ChevronDown, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { SignOutBtnItem } from "./SignOutBtnItem";

interface ProfileButtonProps {
  readonly user: UserProps;
}

function getInitials(name: string): string {
  const nameInitials = name.split(" ").map((word) => word.charAt(0));
  return `${nameInitials.at(0)}${nameInitials.length > 1 ? nameInitials.at(-1) : ""}`;
}

export function ProfileButton({ user }: ProfileButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-md border border-transparent p-1 outline-none ring-ring ring-offset-2 ring-offset-black duration-200 hover:border-foreground/20 hover:bg-black focus:ring-2">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <div className="relative flex size-8 shrink-0 overflow-hidden rounded-full">
          <span className="flex size-full items-center justify-center rounded-full bg-muted">
            {getInitials(user.name)}
          </span>
        </div>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="p-2">
          <a href="/settings">
            <User className="mr-2 size-4" />
            Settings
          </a>
        </DropdownMenuItem>
        <SignOutBtnItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
