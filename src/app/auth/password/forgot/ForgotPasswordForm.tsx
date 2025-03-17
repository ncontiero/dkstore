"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { forgotPasswordAction } from "@/actions/auth";
import {
  type ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/actions/auth/schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function ForgotPasswordForm({ email }: { readonly email?: string }) {
  const forgotPassword = useAction(forgotPasswordAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Password reset email sent");
    },
  });

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: email || "",
    },
  });

  function onSubmit(data: ForgotPasswordSchema) {
    forgotPassword.execute(data);
  }

  return (
    <form className="mt-8 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
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

      <Button
        type="submit"
        className="w-full rounded-full"
        disabled={forgotPassword.status === "executing"}
      >
        {forgotPassword.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Send password reset email"
        )}
      </Button>
    </form>
  );
}
