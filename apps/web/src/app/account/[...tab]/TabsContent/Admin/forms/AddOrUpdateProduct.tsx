"use client";

import type { Product } from "@dkstore/db";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { DialogClose, DialogFooter } from "@dkstore/ui/dialog";
import { Input } from "@dkstore/ui/input";
import { Label } from "@dkstore/ui/label";
import { Textarea } from "@dkstore/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { addOrUpdateProductAdminAction } from "@/actions/admin";
import {
  type AddOrUpdateProductAdminSchema,
  addOrUpdateProductAdminSchema,
} from "@/actions/admin/schema";

export function AddOrUpdateProductForm({
  product,
}: {
  readonly product?: Product;
}) {
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);

  const addOrUpdateProductAdmin = useAction(addOrUpdateProductAdminAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: ({ input: { id } }) => {
      toast.success(`Product ${id ? "updated" : "added"} successfully`);
      dialogCloseRef.current?.click();
    },
  });

  const form = useForm({
    resolver: zodResolver(addOrUpdateProductAdminSchema),
    defaultValues: product,
  });

  function onSubmit(data: AddOrUpdateProductAdminSchema) {
    addOrUpdateProductAdmin.execute(data);
  }

  return (
    <form
      className="mt-2 flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-muted-foreground">
          Name
        </Label>
        <Input type="text" id="name" {...form.register("name")} />

        {form.formState.errors.name ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-muted-foreground">
          Description
        </Label>
        <Textarea id="description" {...form.register("description")} />

        {form.formState.errors.description ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="price" className="text-muted-foreground">
          Price
        </Label>
        <Input type="number" id="price" {...form.register("price")} />

        {form.formState.errors.price ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.price.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="stock" className="text-muted-foreground">
          Stock
        </Label>
        <Input type="number" id="stock" {...form.register("stock")} />

        {form.formState.errors.stock ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.stock.message}
          </p>
        ) : null}
      </div>

      <DialogFooter>
        <DialogClose asChild ref={dialogCloseRef}>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={addOrUpdateProductAdmin.status === "executing"}
        >
          {addOrUpdateProductAdmin.status === "executing" ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
