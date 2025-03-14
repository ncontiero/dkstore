"use client";

import type { User } from "@/utils/types";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { sendEmailVerificationAction } from "@/app/auth/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { updateUserAction } from "../actions";
import { type UpdateUserSchema, updateUserSchema } from "../actions/schema";
import { DeleteProfile } from "../DeleteProfile";

interface ProfileFormProps {
  readonly user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const updateUser = useAction(updateUserAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess({ data: resultMsg }) {
      toast.success(resultMsg);
    },
  });
  const sendVerificationEmail = useAction(sendEmailVerificationAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: ({ data: resultMsg }) => {
      toast.success(resultMsg);
    },
  });

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  function onSubmit(data: UpdateUserSchema) {
    updateUser.execute(data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" {...form.register("name")} />

        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="email">Email</Label>
          <Badge variant={user.isEmailVerified ? "secondary" : "destructive"}>
            {user.isEmailVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <Input id="email" type="email" {...form.register("email")} />

        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Button
          type="submit"
          disabled={
            updateUser.status === "executing" ||
            (user.name === form.watch("name") &&
              user.email === form.watch("email"))
          }
        >
          {updateUser.status === "executing" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
        {!user.isEmailVerified ? (
          <Button
            type="button"
            className="gap-2"
            variant="outline"
            onClick={() => sendVerificationEmail.execute()}
            disabled={sendVerificationEmail.status === "executing"}
          >
            {sendVerificationEmail.status === "executing" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {sendVerificationEmail.status === "executing"
              ? "Sending"
              : "Resend"}{" "}
            verification email
          </Button>
        ) : (
          <DeleteProfile />
        )}
      </div>
    </form>
  );
}
