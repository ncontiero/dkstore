import type { User } from "@/utils/types";
import { LockKeyhole } from "lucide-react";
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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { ForgotPasswordBtn } from "./ForgotPasswordBtn";
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <AccountCardFooterDescription asChild>
              <Button variant="link" className="h-fit p-0">
                Forgot password? Click here.
              </Button>
            </AccountCardFooterDescription>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset password</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset your password? You will receive
                an email with a link to reset your password.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <ForgotPasswordBtn userEmail={user.email} />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
