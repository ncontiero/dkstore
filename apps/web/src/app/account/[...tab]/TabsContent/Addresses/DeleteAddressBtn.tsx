"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { DialogClose, DialogFooter } from "@dkstore/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteAddressAction } from "@/actions/account";

export function DeleteAddressButton({
  addressId,
}: {
  readonly addressId: number;
}) {
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const deleteAddress = useAction(deleteAddressAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Address deleted successfully");
      dialogCloseRef.current?.click();
    },
  });

  return (
    <DialogFooter>
      <DialogClose ref={dialogCloseRef} asChild>
        <Button variant="secondary">Cancel</Button>
      </DialogClose>
      <Button
        type="button"
        onClick={() => deleteAddress.execute({ id: addressId })}
        disabled={deleteAddress.status === "executing"}
      >
        {deleteAddress.status === "executing" ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Delete address"
        )}
      </Button>
    </DialogFooter>
  );
}
