import type { User } from "@/utils/types";

import Image from "next/image";
import { api } from "@/utils/api";
import { ProfileButton } from "./ProfileButton";
import { Link } from "./ui/Link";

export async function Header() {
  const { content } = await api.get<User>("profile", {
    throwError: false,
  });
  const user = content?.data;

  return (
    <header className="fixed inset-x-0 z-[999] h-[72px] border-b bg-secondary/60 backdrop-blur-md">
      <nav className="m-auto flex size-full max-w-[1600px] items-center justify-between gap-2 px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="group rounded-full">
            <Image
              src="/icon"
              alt="icon"
              width={42}
              height={42}
              className="rounded-full duration-200 group-hover:brightness-150"
            />
            <span className="text-xl font-bold">kStore</span>
          </Link>
        </div>

        {user ? (
          <ProfileButton user={user} />
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="rounded-md p-2 font-bold text-foreground hover:text-foreground/60"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-md p-2 font-bold text-foreground hover:text-foreground/60"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
