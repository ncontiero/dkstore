"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { forgotPasswordAction } from "@/actions/auth";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/AlertDialog";

export function ForgotPasswordBtn({
  userEmail,
}: {
  readonly userEmail: string;
}) {
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const forgotPassword = useAction(forgotPasswordAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Email sent successfully");
      dialogCloseRef.current?.click();
    },
  });

  return (
    <>
      <AlertDialogCancel ref={dialogCloseRef}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        type="button"
        onClick={(e) => {
          e.preventDefault();
          forgotPassword.execute({ email: userEmail });
        }}
        disabled={
          forgotPassword.status === "executing" ||
          forgotPassword.status === "hasSucceeded"
        }
      >
        {forgotPassword.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : forgotPassword.status === "hasSucceeded" ? (
          "Email sent"
        ) : (
          "Reset"
        )}
      </AlertDialogAction>
    </>
  );
}
