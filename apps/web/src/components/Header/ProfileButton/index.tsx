import type { User as UserProps } from "@/utils/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dkstore/ui/dropdown-menu";
import {
  BookHeart,
  ChevronDown,
  Menu,
  ShoppingBasket,
  User,
} from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

export function ProfileButton({ user }: { readonly user: UserProps }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-10 items-center justify-center gap-1 rounded-full border border-transparent p-1 outline-none ring-ring ring-offset-2 ring-offset-background duration-200 hover:border-foreground/60 focus:ring-2 md:size-auto md:gap-2 md:rounded-md">
        <div className="hidden flex-col items-end md:flex">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
        <Menu className="md:hidden" />
        <ChevronDown className="hidden size-4 text-muted-foreground md:flex" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="md:w-36">
        <DropdownMenuItem asChild className="p-2">
          <Link
            href="/account/data"
            className="flex cursor-pointer items-center gap-2"
          >
            <User className="size-4" />
            My account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="p-2">
          <Link
            href="/account/orders"
            className="flex cursor-pointer items-center gap-2"
          >
            <ShoppingBasket className="size-4" />
            My orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="p-2">
          <Link
            href="/account/favorites"
            className="flex cursor-pointer items-center gap-2"
          >
            <BookHeart className="size-4" />
            My favorites
          </Link>
        </DropdownMenuItem>
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
