"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { DialogClose } from "@dkstore/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { sendEmailToChangeEmailAction } from "@/actions/account";

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
      <DialogClose ref={dialogCloseRef} asChild>
        <Button variant="secondary">Cancel</Button>
      </DialogClose>
      <Button
        type="button"
        onClick={() => changeEmail.execute()}
        disabled={changeEmail.status === "executing"}
      >
        {changeEmail.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Change email"
        )}
      </Button>
    </>
  );
}
