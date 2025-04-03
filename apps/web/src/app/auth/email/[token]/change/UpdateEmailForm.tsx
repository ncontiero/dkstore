"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { Input } from "@dkstore/ui/input";
import { Label } from "@dkstore/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { updateUserEmailAction } from "@/actions/account";
import {
  type UpdateUserEmailSchema,
  updateUserEmailSchema,
} from "@/actions/account/schema";

export function UpdateEmailForm() {
  const updateEmail = useAction(updateUserEmailAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Email updated successfully");
    },
  });

  const form = useForm({
    resolver: zodResolver(updateUserEmailSchema),
  });

  function onSubmit(data: UpdateUserEmailSchema) {
    updateEmail.execute(data);
  }

  return (
    <form className="mt-8 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label htmlFor="email">New email</Label>
        <Input
          type="email"
          id="email"
          autoComplete="email"
          placeholder="Enter your new email"
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
        disabled={updateEmail.status === "executing"}
      >
        {updateEmail.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Update email"
        )}
      </Button>
    </form>
  );
}
