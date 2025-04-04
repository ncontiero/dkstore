import type { Product } from "@dkstore/db";
import type { ReactNode } from "react";
import { Button } from "@dkstore/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@dkstore/ui/dialog";
import { AddOrUpdateProductForm } from "../forms/AddOrUpdateProduct";

interface AddOrUpdateProductProps {
  readonly product?: Product;
  readonly children?: ReactNode;
}

export function AddOrUpdateProduct({
  product,
  children,
}: AddOrUpdateProductProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button size="sm">{product ? "Update" : "Create"} Product</Button>
        )}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-xl">
              {product ? "Update" : "Create"} product
            </DialogTitle>
            <DialogDescription className="text-base">
              You can {product ? "update" : "create"} product here.
            </DialogDescription>
          </DialogHeader>
          <AddOrUpdateProductForm product={product} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
