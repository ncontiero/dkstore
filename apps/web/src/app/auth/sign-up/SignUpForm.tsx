"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { Input } from "@dkstore/ui/input";
import { Label } from "@dkstore/ui/label";
import { PasswordInput } from "@dkstore/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { signUpAction } from "@/actions/auth";
import { type SignUpSchema, signUpSchema } from "@/actions/auth/schema";
import { BaseAuthFormContainer } from "../BaseFormContainer";

export function SignUpForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;
  const signUp = useAction(signUpAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess() {
      toast.success(
        "Account created successfully! Please check your email to verify your account",
      );
    },
  });

  const form = useForm({
    resolver: zodResolver(signUpSchema),
  });

  function onSubmit(data: SignUpSchema) {
    signUp.execute({ ...data, redirectTo });
  }

  return (
    <BaseAuthFormContainer mode="signup" redirectTo={redirectTo}>
      <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            autoComplete="name"
            placeholder="Enter your name"
            {...form.register("name")}
          />

          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </div>

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

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={signUp.status === "executing"}
        >
          {signUp.status === "executing" ? (
            <Loader className="animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </BaseAuthFormContainer>
  );
}
