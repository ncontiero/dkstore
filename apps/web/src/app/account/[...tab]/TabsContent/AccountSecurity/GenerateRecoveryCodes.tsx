"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { CopyButton } from "@dkstore/ui/copy-button";
import { DialogClose, DialogFooter } from "@dkstore/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { generateRecoveryCodesAction } from "@/actions/account";

export function GenerateRecoveryCodes({ userId }: { readonly userId: string }) {
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const hasRecoveryCodes = recoveryCodes.length > 0;

  const generateRecoveryCodes = useAction(generateRecoveryCodesAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: (args) => {
      toast.success("Recovery codes generated successfully");
      setRecoveryCodes(args.data || []);
    },
  });

  return (
    <>
      {hasRecoveryCodes ? (
        <div>
          <p className="my-4 text-base font-bold">Backup codes</p>
          <p className="text-sm text-foreground/80">
            Save these backup codes in a safe place. You can use them to recover
            your account if you lose your device.
          </p>
          <div className="my-4 rounded-md border">
            <div className="grid grid-cols-2 gap-2 px-7 py-4">
              {recoveryCodes.map((code) => (
                <div key={code} className="text-center text-sm">
                  {code}
                </div>
              ))}
            </div>
            <CopyButton
              valueToCopy={recoveryCodes.join(" ")}
              className="w-full gap-2 rounded-t-none border-t-2 border-border"
            >
              Copy all codes
            </CopyButton>
          </div>
        </div>
      ) : null}
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant={hasRecoveryCodes ? "default" : "secondary"}
            disabled={generateRecoveryCodes.status === "executing"}
            size="sm"
          >
            {hasRecoveryCodes ? "Finish" : "Close"}
          </Button>
        </DialogClose>
        {!hasRecoveryCodes ? (
          <Button
            type="button"
            disabled={generateRecoveryCodes.status === "executing"}
            onClick={() => generateRecoveryCodes.execute({ userId })}
            size="sm"
          >
            {generateRecoveryCodes.status === "executing" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        ) : null}
      </DialogFooter>
    </>
  );
}
