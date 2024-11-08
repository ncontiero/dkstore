"use client";

import type { User } from "@/utils/types";

// import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useFormState } from "@/hooks/useFormState";
// import { api } from "@/utils/api";
import { type UpdateProfileDataKeys, updateProfileAction } from "./actions";
// import { DeleteProfile } from "./DeleteProfile";

interface ProfileFormProps {
  readonly user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  // const [isSendingEmailVerification, setIsSendingEmailVerification] =
  //   useState(false);
  // const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<UpdateProfileDataKeys>(
      (data) => updateProfileAction(data, user),
      (message) => {
        toast.success(message);
        router.refresh();
      },
    );

  // const requestEmailVerification = useCallback(async () => {
  //   setIsSendingEmailVerification(true);
  //   const { ok } = await api.post("requestEmailVerification", {
  //     throwError: false,
  //   });
  //   if (!ok) {
  //     toast.error(
  //       "Failed to request email verification. Please try again later.",
  //     );
  //     setIsSendingEmailVerification(false);
  //     return;
  //   }
  //   toast.success("Email verification link sent to your email address.");
  //   setIsSendingEmailVerification(false);
  // }, []);

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      {success === false && message ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Profile update failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input name="name" id="name" type="text" defaultValue={user.name} />

        {errors?.name ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="email">Email</Label>
          <Badge variant={user.verifiedEmail ? "secondary" : "destructive"}>
            {user.verifiedEmail ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <Input name="email" id="email" type="email" defaultValue={user.email} />

        {errors?.email ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save changes"
          )}
        </Button>
        {/* {!user.verifiedEmail ? (
          <Button
            type="button"
            disabled={isSendingEmailVerification}
            className="gap-2"
            onClick={() => requestEmailVerification()}
          >
            {isSendingEmailVerification ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {isSendingEmailVerification ? "Sending" : "Resend"} verification
            email
          </Button>
        ) : (
          <DeleteProfile
            isDeletingProfile={isDeletingProfile}
            setIsDeletingProfile={setIsDeletingProfile}
          />
        )} */}
      </div>
    </form>
  );
}
