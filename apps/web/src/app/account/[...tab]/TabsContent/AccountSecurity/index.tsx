import type { User } from "@/utils/types";
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
import { Link } from "@dkstore/ui/link";
import { Separator } from "@dkstore/ui/separator";
import { LockKeyhole } from "lucide-react";
import {
  AccountCard,
  AccountCardContent,
  AccountCardDescription,
  AccountCardFooter,
  AccountCardFooterDescription,
  AccountCardTitle,
} from "@/components/Account";
import { UpdatePasswordForm } from "./forms/UpdatePasswordForm";

export function AccountSecurity({ user }: { readonly user: User }) {
  return (
    <AccountCard>
      <AccountCardContent>
        <AccountCardTitle>Password</AccountCardTitle>
        <AccountCardDescription>This is your password</AccountCardDescription>
        <div className="flex items-center rounded-md border p-4">
          <div className="flex items-center gap-3">
            <LockKeyhole className="size-5 text-primary" />
            <span className="text-sm text-muted-foreground">**********</span>
          </div>
        </div>
      </AccountCardContent>
      <AccountCardFooter>
        <AccountCardFooterDescription asChild>
          <Link href={`/auth/password/forgot?email=${user.email}`}>
            Forgot password? Click here.
          </Link>
        </AccountCardFooterDescription>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Change password</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="my-2 text-xl">
                  Change your password
                </DialogTitle>
                <DialogDescription className="text-foreground/80">
                  Update your password. Make sure it&apos;s least 8 characters
                  long, and includes a combination of numbers, letters and
                  special characters.
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <UpdatePasswordForm />
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </AccountCardFooter>
    </AccountCard>
  );
}
