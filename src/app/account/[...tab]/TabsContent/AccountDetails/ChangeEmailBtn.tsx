"use client";

import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { AlertDialogAction } from "@/components/ui/AlertDialog";
import { sendEmailToChangeEmailAction } from "../../actions";

export function ChangeEmailBtn() {
  const changeEmail = useAction(sendEmailToChangeEmailAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: () => {
      toast.success("Email sent successfully");
    },
  });

  return (
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
  );
}
