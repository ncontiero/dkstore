import type { User } from "@/utils/types";
import {
  AccountCard,
  AccountCardContent,
  AccountCardDescription,
  AccountCardFooter,
  AccountCardFooterDescription,
  AccountCardTitle,
} from "@/components/Account";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";

export function AccountDetails({ user }: { readonly user: User }) {
  return (
    <>
      <AccountCard asChild>
        <form>
          <AccountCardContent>
            <Label className="flex flex-col" htmlFor="name">
              <AccountCardTitle>Name</AccountCardTitle>
              <AccountCardDescription>
                Please enter your full name.
              </AccountCardDescription>
            </Label>
            <Input type="text" id="name" defaultValue={user.name} />
          </AccountCardContent>
          <AccountCardFooter>
            <AccountCardFooterDescription>
              Please use 32 characters at maximum.
            </AccountCardFooterDescription>
            <Button type="submit" size="sm">
              Save
            </Button>
          </AccountCardFooter>
        </form>
      </AccountCard>
      <AccountCard>
        <AccountCardContent>
          <AccountCardTitle>Email</AccountCardTitle>
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm">Change email</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change email</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to change your email address? You will
                    receive an email with a link to change your email address.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Change</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button type="button" size="sm">
              Resend verification email
            </Button>
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
                <form className="mt-4 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="confirm-email"
                      className="text-muted-foreground"
                    >
                      Enter your <span className="text-foreground">email</span>{" "}
                      to continue:
                    </Label>
                    <Input type="email" id="confirm-email" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-muted-foreground"
                    >
                      Confirm your{" "}
                      <span className="text-foreground">password</span> to
                      continue:
                    </Label>
                    <PasswordInput id="confirm-password" />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" variant="destructive">
                      Delete
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </DialogPortal>
          </Dialog>
        </AccountCardFooter>
      </AccountCard>
    </>
  );
}
