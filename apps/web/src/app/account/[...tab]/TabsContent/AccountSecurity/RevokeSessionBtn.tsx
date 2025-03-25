"use client";

import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { DialogClose, DialogFooter } from "@dkstore/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { revokeSessionAction } from "@/actions/account";

export function RevokeSessionBtn({
  sessionId,
}: {
  readonly sessionId: string;
}) {
  const revokeSession = useAction(revokeSessionAction, {
    onSuccess: () => {
      toast.success("Session revoked");
    },
    onError: (args) => {
      toast.error(args.error.serverError);
    },
  });

  return (
    <DialogFooter>
      <DialogClose asChild>
        <Button type="button" variant="secondary" size="sm">
          Cancel
        </Button>
      </DialogClose>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={revokeSession.status === "executing"}
        onClick={() => revokeSession.execute({ sessionId })}
      >
        {revokeSession.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Revoke session"
        )}
      </Button>
    </DialogFooter>
  );
}
