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
  AlertDialogAction,
  AlertDialogCancel,
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
import { Label } from "@/components/ui/Label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Separator } from "@/components/ui/Separator";

export function AccountSecurity() {
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Reset</AlertDialogAction>
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
              <form className="mt-4 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="current-password"
                    className="text-muted-foreground"
                  >
                    Enter your{" "}
                    <span className="text-foreground">current password</span>:
                  </Label>
                  <PasswordInput id="current-password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="new-password"
                    className="text-muted-foreground"
                  >
                    Enter your{" "}
                    <span className="text-foreground">new password</span>:
                  </Label>
                  <PasswordInput id="new-password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="confirm-new-password"
                    className="text-muted-foreground"
                  >
                    Confirm your{" "}
                    <span className="text-foreground">new password</span>:
                  </Label>
                  <PasswordInput id="confirm-new-password" />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Update</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </AccountCardFooter>
    </AccountCard>
  );
}
