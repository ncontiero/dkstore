"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { Label } from "@dkstore/ui/label";
import { PasswordInput } from "@dkstore/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/actions/auth";
import {
  type ResetPasswordSchema,
  resetPasswordSchema,
} from "@/actions/auth/schema";

export function ResetPasswordForm({ userId }: { readonly userId: string }) {
  const router = useRouter();

  const resetPassword = useAction(resetPasswordAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push("/auth/sign-in");
    },
  });

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      userId,
    },
  });

  function onSubmit(data: ResetPasswordSchema) {
    resetPassword.execute(data);
  }

  return (
    <form className="mt-8 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          {...form.register("password")}
        />

        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <PasswordInput
          id="confirm-password"
          placeholder="Enter your new password"
          {...form.register("confirmPassword")}
        />

        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={resetPassword.status === "executing"}
      >
        {resetPassword.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
