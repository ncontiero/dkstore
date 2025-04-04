"use client";

import type { Product } from "@dkstore/db";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@dkstore/ui/dialog";
import { DropdownMenuItem } from "@dkstore/ui/dropdown-menu";
import { Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteProductAdminAction } from "@/actions/admin";

interface DeleteProductProps {
  readonly product: Product;
}

export function DeleteProduct({ product }: DeleteProductProps) {
  const deleteDialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const deleteProduct = useAction(deleteProductAdminAction, {
    onSuccess: () => {
      toast.success("Product deleted");
      deleteDialogCloseRef.current?.click();
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer gap-2 p-2 text-destructive"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-xl">Delete product</DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to delete this product? If the product is
              already ordered, it will be marked as inactive and deleted from
              the database. If not, it will be deleted from the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild ref={deleteDialogCloseRef}>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => deleteProduct.execute({ id: product.id })}
              disabled={deleteProduct.status === "executing"}
            >
              {deleteProduct.status === "executing" ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
