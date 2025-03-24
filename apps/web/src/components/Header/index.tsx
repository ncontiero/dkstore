import { Button } from "@dkstore/ui/button";
import { Link } from "@dkstore/ui/link";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { getSession } from "@/lib/auth/db";
import { ProfileButton } from "./ProfileButton";
import { SearchDialog } from "./Search/Dialog";
import { SearchForm } from "./Search/Form";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const session = await getSession({});

  return (
    <header className="sticky inset-x-0 top-0 z-[9999] h-14 w-full border-b-2 border-secondary bg-secondary/60 backdrop-blur md:h-16">
      <div className="flex size-full items-center justify-between gap-4 px-4 py-2 sm:container">
        <div className="flex items-center gap-3">
          <Link href="/" className="group rounded-full text-foreground">
            <Image
              src="/icon"
              alt="icon"
              width={42}
              height={42}
              className="rounded-full duration-200 group-hover:brightness-200"
            />
            <span className="text-xl font-bold">Store</span>
          </Link>
        </div>
        <SearchForm />
        <div className="flex gap-1">
          <SearchDialog />
          {session?.user ? (
            <ProfileButton user={session.user} />
          ) : (
            <>
              <Button
                asChild
                variant="ghostOutline"
                className="hidden px-2 text-center lg:flex"
              >
                <NextLink href="/auth/sign-up">Create account</NextLink>
              </Button>
              <Button asChild variant="ghostOutline" className="flex px-2">
                <NextLink href="/auth/sign-in">Sign In</NextLink>
              </Button>
            </>
          )}
          <Button
            asChild
            variant="ghostOutline"
            size="icon"
            className="rounded-full"
          >
            <NextLink href="/cart" title="Cart">
              <ShoppingCart />
            </NextLink>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
