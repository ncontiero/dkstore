import type { SessionWhitUser } from "@/utils/types";
import { Badge } from "@dkstore/ui/badge";
import { Button } from "@dkstore/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@dkstore/ui/dialog";
import { Separator } from "@dkstore/ui/separator";
import { cn } from "@dkstore/ui/utils";
import {
  AccountCard,
  AccountCardContent,
  AccountCardDescription,
  AccountCardFooter,
  AccountCardFooterDescription,
  AccountCardTitle,
} from "@/components/Account";
import { Confirm2FA } from "@/components/Confirm2FA";
import { ChangeEmailBtn } from "./ChangeEmailBtn";
import { DeleteUserForm } from "./forms/DeleteUserForm";
import { UpdateUserNameForm } from "./forms/UpdateUserNameForm";
import { VerifyEmailBtn } from "./VerifyEmailBtn";

export function AccountDetails({
  session,
}: {
  readonly session: SessionWhitUser;
}) {
  const { user } = session;

  return (
    <>
      <UpdateUserNameForm user={user} />
      <AccountCard>
        <AccountCardContent>
          <AccountCardTitle id="email">Email</AccountCardTitle>
          <AccountCardDescription>
            This is your email address.
          </AccountCardDescription>
          <div className="flex items-center rounded-md border p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">{user.email}</span>
              <Badge
                variant={user.isEmailVerified ? "secondary" : "destructive"}
              >
                {user.isEmailVerified ? "Verified" : "Not verified"}
              </Badge>
            </div>
          </div>
        </AccountCardContent>
        <AccountCardFooter>
          <AccountCardFooterDescription>
            {user.isEmailVerified
              ? "You will receive a verification email to your email address."
              : "Your email is not verified. Please verify your email address."}
          </AccountCardFooterDescription>
          {user.isEmailVerified ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Change email</Button>
              </DialogTrigger>
              <DialogPortal>
                <DialogOverlay />
                <Confirm2FA session={session}>
                  <DialogHeader>
                    <DialogTitle className="my-2 text-xl">
                      Change email
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Are you sure you want to change your email address? You
                      will receive an email with a link to change your email
                      address.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <ChangeEmailBtn />
                  </DialogFooter>
                </Confirm2FA>
              </DialogPortal>
            </Dialog>
          ) : (
            <VerifyEmailBtn />
          )}
        </AccountCardFooter>
      </AccountCard>
      <AccountCard className="border-destructive/60">
        <AccountCardContent>
          <AccountCardTitle>Delete Account</AccountCardTitle>
          <AccountCardDescription>
            Once you delete your account, there is no going back. Please be
            certain.
          </AccountCardDescription>
        </AccountCardContent>
        <AccountCardFooter
          className={cn(
            "border-destructive/60 bg-destructive/20",
            user.isEmailVerified && "sm:justify-end",
          )}
        >
          {!user.isEmailVerified && (
            <AccountCardFooterDescription className="font-medium text-foreground">
              You must verify your email address before you can delete your
              account.
            </AccountCardFooterDescription>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!user.isEmailVerified}
                size="sm"
              >
                Delete your account
              </Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="my-2 text-xl">
                    Delete your account
                  </DialogTitle>
                  <DialogDescription className="text-foreground/80">
                    Are you sure you want to delete your account? This action
                    cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-md bg-destructive/20 px-3 py-2 font-medium text-destructive selection:bg-destructive/20">
                  This action is not reversible. Please be certain.
                </div>
                <Separator />
                <DeleteUserForm />
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </AccountCardFooter>
      </AccountCard>
    </>
  );
}
