"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { updateUserPasswordAction } from "@/actions/account";
import {
  type UpdateUserPasswordSchema,
  updateUserPasswordSchema,
} from "@/actions/account/schema";
import { Button } from "@/components/ui/Button";
import { DialogClose, DialogFooter } from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function UpdatePasswordForm() {
  const closeDialogButtonRef = useRef<HTMLButtonElement | null>(null);

  const updatePassword = useAction(updateUserPasswordAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
      closeDialogButtonRef.current?.click();
    },
  });

  const form = useForm<UpdateUserPasswordSchema>({
    resolver: zodResolver(updateUserPasswordSchema),
  });

  function onSubmit(data: UpdateUserPasswordSchema) {
    updatePassword.execute(data);
  }

  return (
    <form
      className="mt-4 flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="current-password" className="text-muted-foreground">
          Enter your <span className="text-foreground">current password</span>:
        </Label>
        <PasswordInput
          id="current-password"
          {...form.register("currentPassword")}
        />

        {form.formState.errors.currentPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.currentPassword.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password" className="text-muted-foreground">
          Enter your <span className="text-foreground">new password</span>:
        </Label>
        <PasswordInput id="new-password" {...form.register("newPassword")} />

        {form.formState.errors.newPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.newPassword.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-new-password" className="text-muted-foreground">
          Confirm your <span className="text-foreground">new password</span>:
        </Label>
        <PasswordInput
          id="confirm-new-password"
          {...form.register("confirmNewPassword")}
        />

        {form.formState.errors.confirmNewPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmNewPassword.message}
          </p>
        ) : null}
      </div>
      <DialogFooter>
        <DialogClose asChild ref={closeDialogButtonRef}>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={updatePassword.status === "executing"}>
          {updatePassword.status === "executing" ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Update"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
