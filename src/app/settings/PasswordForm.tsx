"use client";

import { toast } from "react-toastify";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";

import { type UpdatePasswordDataKeys, updatePasswordAction } from "./actions";

export function PasswordForm() {
  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<UpdatePasswordDataKeys>(updatePasswordAction, (message) => {
      toast.success(message);
    });

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Update password failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="Enter your current password"
        />

        {errors?.currentPassword ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.currentPassword[0]}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="Enter your new password"
        />

        {errors?.newPassword ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.newPassword[0]}
          </p>
        ) : null}
      </div>
      <div className="mt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save password"
          )}
        </Button>
      </div>
    </form>
  );
}
