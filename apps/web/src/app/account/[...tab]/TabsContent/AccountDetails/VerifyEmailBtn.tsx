"use client";

import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { sendEmailVerificationAction } from "@/actions/account";

export function VerifyEmailBtn() {
  const sendVerificationEmail = useAction(sendEmailVerificationAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Email verification link sent");
    },
  });

  return (
    <Button
      type="button"
      size="sm"
      onClick={() => sendVerificationEmail.execute()}
      disabled={sendVerificationEmail.status === "executing"}
    >
      {sendVerificationEmail.status === "executing" ? (
        <Loader2 className="animate-spin" />
      ) : (
        "Resend verification email"
      )}
    </Button>
  );
}
