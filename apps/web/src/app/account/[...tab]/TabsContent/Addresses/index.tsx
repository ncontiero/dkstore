import type { SessionWhitUser } from "@/utils/types";
import { prisma } from "@dkstore/db";
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
import { Separator } from "@dkstore/ui/separator";
import {
  AccountCard,
  AccountCardContent,
  AccountCardDescription,
  AccountCardFooter,
  AccountCardFooterDescription,
  AccountCardTitle,
} from "@/components/Account";
import { DeleteAddressButton } from "./DeleteAddressBtn";
import { AddOrUpdateAddress } from "./forms/AddOrUpdateAddress";

export async function Addresses({
  session,
}: {
  readonly session: SessionWhitUser;
}) {
  const { user } = session;
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
  });

  return (
    <AccountCard>
      <AccountCardContent>
        <AccountCardTitle>Addresses</AccountCardTitle>
        <AccountCardDescription>
          Manage your shipping and billing addresses.
        </AccountCardDescription>
        <div className="my-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex flex-col text-muted-foreground border rounded-md p-4"
            >
              <p>
                {address.street} {address.number}
              </p>
              <p>{address.neighborhood}</p>
              <p>
                {address.city}, {address.state}, {address.zipCode}
              </p>
              <p>{address.country}</p>
              {address.complement ? <p>{address.complement}</p> : null}
              {address.isDefault ? (
                <p className="text-sm text-green-500 mt-1">Default address</p>
              ) : null}
              <Separator className="my-4" />
              <div className="flex items-center gap-2 justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="link" className="p-0 h-auto">
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                      <DialogHeader className="space-y-4">
                        <DialogTitle className="text-xl">
                          Update address
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Update your address information.
                        </DialogDescription>
                      </DialogHeader>
                      <AddOrUpdateAddress address={address} />
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-destructive ring-destructive"
                      disabled={addresses.length === 1}
                    >
                      {addresses.length === 1 && (
                        <span className="sr-only">
                          You cannot delete the only address registered in your
                          account.
                        </span>
                      )}
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogPortal>
                    <DialogOverlay />
                    <DialogContent>
                      <DialogHeader className="space-y-4">
                        <DialogTitle className="text-xl">
                          Delete address
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          Are you sure you want to delete this address? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DeleteAddressButton addressId={address.id} />
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </AccountCardContent>
      <AccountCardFooter>
        <AccountCardFooterDescription>
          {addresses.length > 0
            ? `You have ${addresses.length} addresses registered in your account.`
            : "You don't have any addresses registered in your account."}
        </AccountCardFooterDescription>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Add address</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader className="space-y-4">
                <DialogTitle className="text-xl">Add address</DialogTitle>
                <DialogDescription className="text-base">
                  Add a new address to your account.
                </DialogDescription>
              </DialogHeader>
              <AddOrUpdateAddress />
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </AccountCardFooter>
    </AccountCard>
  );
}
