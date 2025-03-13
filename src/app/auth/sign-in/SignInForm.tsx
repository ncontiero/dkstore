"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { signInAction } from "../actions";
import { type SignInSchema, signInSchema } from "../actions/schema";
import { BaseAuthFormContainer } from "../BaseFormContainer";

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;
  const signIn = useAction(signInAction, {
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  function onSubmit(data: SignInSchema) {
    signIn.execute({ ...data, redirectTo });
  }

  return (
    <BaseAuthFormContainer redirectTo={redirectTo}>
      <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="Enter your email"
            {...form.register("email")}
          />

          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...form.register("password")}
          />

          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full rounded-full">
          {signIn.status === "executing" ? (
            <Loader className="animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </BaseAuthFormContainer>
  );
}
