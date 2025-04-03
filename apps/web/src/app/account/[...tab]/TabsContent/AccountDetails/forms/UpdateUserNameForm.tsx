"use client";

import type { User } from "@/utils/types";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { Input } from "@dkstore/ui/input";
import { Label } from "@dkstore/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { updateUserNameAction } from "@/actions/account";
import {
  type UpdateUserNameSchema,
  updateUserNameSchema,
} from "@/actions/account/schema";
import {
  AccountCard,
  AccountCardContent,
  AccountCardDescription,
  AccountCardFooter,
  AccountCardFooterDescription,
  AccountCardTitle,
} from "@/components/Account";

export function UpdateUserNameForm({ user }: { readonly user: User }) {
  const updateUserName = useAction(updateUserNameAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Name updated successfully");
    },
  });

  const form = useForm({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      name: user.name,
    },
  });

  function onSubmit(data: UpdateUserNameSchema) {
    updateUserName.execute(data);
  }

  return (
    <AccountCard asChild>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AccountCardContent>
          <Label className="flex flex-col" htmlFor="name">
            <AccountCardTitle>Name</AccountCardTitle>
            <AccountCardDescription>
              Please enter your full name.
            </AccountCardDescription>
          </Label>
          <Input type="text" id="name" {...form.register("name")} />

          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          ) : null}
        </AccountCardContent>
        <AccountCardFooter>
          <AccountCardFooterDescription>
            Please use 32 characters at maximum.
          </AccountCardFooterDescription>
          <Button
            type="submit"
            size="sm"
            disabled={
              updateUserName.status === "executing" ||
              form.watch("name") === user.name
            }
          >
            {updateUserName.status === "executing" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}
