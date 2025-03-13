"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { updateUserPasswordAction } from "../actions";
import {
  type UpdateUserPasswordSchema,
  updateUserPasswordSchema,
} from "../actions/schema";

export function PasswordForm() {
  const form = useForm<UpdateUserPasswordSchema>({
    resolver: zodResolver(updateUserPasswordSchema),
  });

  const updateUserPassword = useAction(updateUserPasswordAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess({ data: resultMsg }) {
      toast.success(resultMsg);
      form.reset();
    },
  });

  function onSubmit(data: UpdateUserPasswordSchema) {
    updateUserPassword.execute(data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <PasswordInput
          id="currentPassword"
          placeholder="Enter your current password"
          {...form.register("currentPassword")}
        />

        {form.formState.errors.currentPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.currentPassword.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New password</Label>
        <PasswordInput
          id="newPassword"
          placeholder="Enter your new password"
          {...form.register("newPassword")}
        />

        {form.formState.errors.newPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.newPassword.message}
          </p>
        ) : null}
      </div>
      <div className="mt-2">
        <Button
          type="submit"
          disabled={updateUserPassword.status === "executing"}
        >
          {updateUserPassword.status === "executing" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save password"
          )}
        </Button>
      </div>
    </form>
  );
}
