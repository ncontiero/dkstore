import type { PropsWithChildren } from "react";
import { Button } from "@dkstore/ui/button";
import { Card } from "@dkstore/ui/card";
import Link from "next/link";

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
    <Card
      title={mode === "signin" ? "Sign in" : "Create your account"}
      description={
        mode === "signin"
          ? "Welcome back! Please sign in to continue"
          : "Welcome! Please fill in the details to get started."
      }
    >
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
    </Card>
  );
}
