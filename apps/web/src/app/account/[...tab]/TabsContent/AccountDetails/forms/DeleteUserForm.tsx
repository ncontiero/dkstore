"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { DialogClose, DialogFooter } from "@dkstore/ui/dialog";
import { Input } from "@dkstore/ui/input";
import { Label } from "@dkstore/ui/label";
import { PasswordInput } from "@dkstore/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteUserAction } from "@/actions/account";
import {
  type DeleteUserSchema,
  deleteUserSchema,
} from "@/actions/account/schema";

export function DeleteUserForm() {
  const deleteUser = useAction(deleteUserAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Account deleted successfully");
    },
  });

  const form = useForm({
    resolver: zodResolver(deleteUserSchema),
  });

  function onSubmit(data: DeleteUserSchema) {
    deleteUser.execute(data);
  }

  return (
    <form
      className="mt-4 flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-email" className="text-muted-foreground">
          Enter your <span className="text-foreground">email</span> to continue:
        </Label>
        <Input
          type="email"
          id="confirm-email"
          {...form.register("confirmEmail")}
        />

        {form.formState.errors.confirmEmail ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmEmail.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-password" className="text-muted-foreground">
          Confirm your <span className="text-foreground">password</span> to
          continue:
        </Label>
        <PasswordInput
          id="confirm-password"
          {...form.register("confirmPassword")}
        />

        {form.formState.errors.confirmPassword ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button
          type="submit"
          variant="destructive"
          disabled={deleteUser.status === "executing"}
        >
          {deleteUser.status === "executing" ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
