"use client";

import type { Address } from "@dkstore/db";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { Checkbox } from "@dkstore/ui/checkbox";
import { DialogClose, DialogFooter } from "@dkstore/ui/dialog";
import { Input } from "@dkstore/ui/input";
import { Label } from "@dkstore/ui/label";
import { ScrollArea, ScrollBar } from "@dkstore/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { addOrUpdateAddressAction } from "@/actions/account";
import {
  type AddOrUpdateAddressSchema,
  addOrUpdateAddressSchema,
} from "@/actions/account/schema";

export function AddOrUpdateAddress({
  address,
}: {
  readonly address?: Address;
}) {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);

  const addNewAddress = useAction(addOrUpdateAddressAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: ({ input: { id } }) => {
      toast.success(`Address ${id ? "updated" : "added"} successfully`);
      closeDialogRef.current?.click();
    },
  });

  const form = useForm<AddOrUpdateAddressSchema>({
    resolver: zodResolver(addOrUpdateAddressSchema),
    defaultValues: {
      ...address,
      number: address?.number ?? "",
      complement: address?.complement ?? "",
    },
  });

  function onSubmit(data: AddOrUpdateAddressSchema) {
    addNewAddress.execute(data);
  }

  return (
    <ScrollArea className="max-h-[564px] relative mb-14 -mx-2">
      <form
        className="mt-4 flex flex-col gap-6 pr-4 pl-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="country" className="text-muted-foreground">
            Country
          </Label>
          <Input
            type="text"
            id="country"
            placeholder="Brazil"
            {...form.register("country")}
          />

          {form.formState.errors.country ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.country.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="zip-code" className="text-muted-foreground">
            Zip Code
          </Label>
          <Input
            type="text"
            id="zip-code"
            placeholder="12345-678"
            {...form.register("zipCode")}
          />

          {form.formState.errors.zipCode ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.zipCode.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="street" className="text-muted-foreground">
            Street
          </Label>
          <Input
            type="text"
            id="street"
            placeholder="123 Main St"
            {...form.register("street")}
          />

          {form.formState.errors.street ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.street.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="number" className="text-muted-foreground">
            Number
          </Label>
          <Input
            type="text"
            id="number"
            placeholder="123"
            {...form.register("number")}
          />

          {form.formState.errors.number ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.number.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="complement" className="text-muted-foreground">
            Complement (optional)
          </Label>
          <Input
            type="text"
            id="complement"
            placeholder="Apartment, suite, etc"
            {...form.register("complement")}
          />

          {form.formState.errors.complement ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.complement.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="neighborhood" className="text-muted-foreground">
            Neighborhood
          </Label>
          <Input
            type="text"
            id="neighborhood"
            placeholder="Downtown"
            {...form.register("neighborhood")}
          />

          {form.formState.errors.neighborhood ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.neighborhood.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="city" className="text-muted-foreground">
            City
          </Label>
          <Input
            type="text"
            id="city"
            placeholder="New York"
            {...form.register("city")}
          />

          {form.formState.errors.city ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.city.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="state" className="text-muted-foreground">
            State
          </Label>
          <Input
            type="text"
            id="state"
            placeholder="New York"
            {...form.register("state")}
          />

          {form.formState.errors.state ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.state.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Label
            htmlFor="is-default"
            className="text-muted-foreground cursor-pointer"
          >
            Set as default address
          </Label>
          <Checkbox
            id="is-default"
            checked={form.watch("isDefault")}
            onCheckedChange={(checked) => {
              form.setValue("isDefault", !!checked);
            }}
          />
        </div>

        <ScrollBar />
        <DialogFooter className="fixed bottom-6 right-6">
          <DialogClose asChild ref={closeDialogRef}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={addNewAddress.status === "executing"}>
            {addNewAddress.status === "executing" ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </form>
    </ScrollArea>
  );
}
