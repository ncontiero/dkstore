"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { sendEmailToChangeEmailAction } from "@/actions/account";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/AlertDialog";

export function ChangeEmailBtn() {
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const changeEmail = useAction(sendEmailToChangeEmailAction, {
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
          changeEmail.execute();
        }}
        disabled={
          changeEmail.status === "executing" ||
          changeEmail.status === "hasSucceeded"
        }
      >
        {changeEmail.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : changeEmail.status === "hasSucceeded" ? (
          "Email sent"
        ) : (
          "Change email"
        )}
      </AlertDialogAction>
    </>
  );
}
