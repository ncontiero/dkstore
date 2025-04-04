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
import { cn } from "@dkstore/ui/utils";
import { Check, Loader2, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { addOrUpdateProductAdminAction } from "@/actions/admin";

interface HandleActiveProductProps {
  readonly product: Product;
}

export function HandleActiveProduct({ product }: HandleActiveProductProps) {
  const handleActiveDialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const updateProduct = useAction(addOrUpdateProductAdminAction, {
    onSuccess: () => {
      toast.success("Product updated successfully");
      handleActiveDialogCloseRef.current?.click();
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className={cn(
            "cursor-pointer gap-2 p-2",
            product.isActive && "text-destructive",
            !product.isActive && "text-primary",
          )}
          onSelect={(e) => e.preventDefault()}
        >
          {product.isActive ? (
            <X className="size-4" />
          ) : (
            <Check className="size-4" />
          )}
          Mark as {product.isActive ? "inactive" : "active"}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-xl">
              Mark as {product.isActive ? "inactive" : "active"}
            </DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to{" "}
              {product.isActive ? "deactivate" : "activate"} this product?{" "}
              {product.isActive
                ? "By deactivating this product, it will no longer be visible to customers. You can reactivate it at any time."
                : "By activating this product, it will be visible to customers. You can deactivate it at any time."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild ref={handleActiveDialogCloseRef}>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() =>
                updateProduct.execute({
                  ...product,
                  isActive: !product.isActive,
                  deletedAt: null,
                })
              }
              disabled={updateProduct.status === "executing"}
            >
              {updateProduct.status === "executing" ? (
                <Loader2 className="animate-spin" />
              ) : (
                `Mark as ${product.isActive ? "inactive" : "active"}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
