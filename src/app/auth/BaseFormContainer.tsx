import type { PropsWithChildren } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface BaseAuthFormContainerProps extends PropsWithChildren {
  readonly mode?: "signin" | "signup";
  readonly redirectTo?: string;
}

export function BaseAuthFormContainer({
  mode = "signin",
  redirectTo,
  children,
}: BaseAuthFormContainerProps) {
  return (
    <div className="xs:px-4 mt-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-md border px-3 py-6 sm:rounded-md sm:p-6">
        <div className="flex flex-col items-center justify-center space-y-1 text-center">
          <h2 className="text-3xl font-bold">
            {mode === "signin" ? "Sign in" : "Create your account"}
          </h2>
          <p className="text-base font-medium text-foreground/60">
            {mode === "signin"
              ? "Welcome back! Please sign in to continue"
              : "Welcome! Please fill in the details to get started."}
          </p>
        </div>

        {children}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-foreground/60">
                {mode === "signin"
                  ? "New to our platform?"
                  : "Already have an account?"}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link
                href={`/auth/${mode === "signin" ? "sign-up" : "sign-in"}${redirectTo ? `?redirect=${redirectTo}` : ""}`}
              >
                {mode === "signin" ? "Create an account" : "Sign In"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
