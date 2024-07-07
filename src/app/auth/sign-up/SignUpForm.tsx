"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Link } from "@/components/ui/Link";
import { Checkbox } from "@/components/ui/CheckBox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

import { type SignUpDataKeys, signUpAction } from "./actions";

export function SignUpForm() {
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<SignUpDataKeys>(signUpAction, (message) => {
      toast.success(message);
      router.push("/");
    });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign up failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-4 flex flex-col items-center justify-center space-y-1 text-center">
        <h2 className="text-lg font-bold">Create your account</h2>
        <p className="text-sm font-medium text-foreground/60">
          Welcome! Please fill in the details to get started.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input name="name" type="text" id="name" />

        {errors?.name ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        ) : null}
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

      <div className="space-y-2">
        <Label htmlFor="password_confirmation">Confirm your password</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
        />

        {errors?.password_confirmation ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password_confirmation[0]}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <Checkbox id="remember_me" name="remember_me" />
        <Label htmlFor="remember_me">Remember me</Label>
      </div>

      <Button type="submit" className="mt-2" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Create account"
        )}
      </Button>

      <div className="mt-2 flex justify-center">
        <Link className="w-fit" size="sm" href="/auth/sign-in">
          Already registered? Sign In
        </Link>
      </div>
    </form>
  );
}
