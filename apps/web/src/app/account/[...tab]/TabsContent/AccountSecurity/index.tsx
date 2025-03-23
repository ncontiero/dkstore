import type { User } from "@/utils/types";
import { Badge } from "@dkstore/ui/badge";
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
import { Confirm2FA } from "@/components/Confirm2FA";
import { AddOrEdit2FA } from "./AddOrEdit2FA";
import { UpdatePasswordForm } from "./forms/UpdatePasswordForm";

export function AccountSecurity({ user }: { readonly user: User }) {
  return (
    <>
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
      <AccountCard>
        <AccountCardContent>
          <AccountCardTitle>
            <span>Two-factor authentication</span>
            <Badge
              className="ml-2"
              variant={user.is2FAEnabled ? "default" : "destructive"}
            >
              {user.is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </AccountCardTitle>
          <AccountCardDescription>
            Two-factor authentication adds an additional layer of security to
            your account by requiring more than just a password to sign in.
          </AccountCardDescription>
        </AccountCardContent>
        <AccountCardFooter>
          <AccountCardFooterDescription>
            Use an authentication app or browser extension to get two-factor
            authentication codes when prompted.
          </AccountCardFooterDescription>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                {user.is2FAEnabled ? "Edit" : "Add"} two-factor authentication
              </Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <Confirm2FA user={user}>
                <DialogHeader>
                  <DialogTitle className="my-2 text-xl">
                    {user.is2FAEnabled ? "Edit" : "Add"} two-factor
                    authentication
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {user.is2FAEnabled ? "Edit" : "Add"} two-factor
                    authentication {user.is2FAEnabled ? "on" : "to"} your
                    account.
                  </DialogDescription>
                </DialogHeader>
                <AddOrEdit2FA is2FAEnabled={user.is2FAEnabled} />
              </Confirm2FA>
            </DialogPortal>
          </Dialog>
        </AccountCardFooter>
      </AccountCard>
    </>
  );
}
