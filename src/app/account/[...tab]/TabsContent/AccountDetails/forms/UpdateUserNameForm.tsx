"use client";

import type { User } from "@/utils/types";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import {
  AccountCard,
  AccountCardContent,
  AccountCardDescription,
  AccountCardFooter,
  AccountCardFooterDescription,
  AccountCardTitle,
} from "@/components/Account";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateUserNameAction } from "../../../actions";
import {
  type UpdateUserNameSchema,
  updateUserNameSchema,
} from "../../../actions/schemas";

export function UpdateUserNameForm({ user }: { readonly user: User }) {
  const updateUserName = useAction(updateUserNameAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Name updated successfully");
    },
  });

  const form = useForm<UpdateUserNameSchema>({
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
