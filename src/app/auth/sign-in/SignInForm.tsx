"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/CheckBox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";

import { useFormState } from "@/hooks/useFormState";
import { type SignInDataKeys, signInWithEmailAndPassword } from "./actions";

export function SignInForm() {
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<SignInDataKeys>(signInWithEmailAndPassword, () => {
      router.push("/");
    });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-4 flex flex-col items-center justify-center space-y-1 text-center">
        <h2 className="text-lg font-bold">Sign in</h2>
        <p className="text-sm font-medium text-foreground/60">
          Welcome back! Please sign in to continue
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />

        {errors?.email ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        {errors?.password ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Checkbox id="rememberMe" name="rememberMe" />
          <Label htmlFor="rememberMe">Remember me</Label>
        </div>
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button type="submit" className="mt-2" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "Sign In"}
      </Button>

      <div className="mt-2 flex justify-center">
        <Link className="w-fit" size="sm" href="/auth/sign-up">
          Create new account
        </Link>
      </div>
    </form>
  );
}
