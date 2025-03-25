import type { SessionWhitUser } from "@/utils/types";
import { prisma } from "@dkstore/db";
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
import { formatDistanceToNow } from "date-fns";
import { CircleX, Laptop, LockKeyhole, Smartphone } from "lucide-react";
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
import { GenerateRecoveryCodes } from "./GenerateRecoveryCodes";
import { RevokeSessionBtn } from "./RevokeSessionBtn";

export async function AccountSecurity({
  session,
  recoveryCodesLength = 0,
}: {
  readonly session: SessionWhitUser;
  readonly recoveryCodesLength?: number;
}) {
  const { user } = session;
  const sessions = (
    await prisma.session.findMany({
      where: { userId: user.id },
    })
  ).sort((a, b) => {
    if (a.id === session.id) return -1;
    if (b.id === session.id) return 1;
    return 0;
  });

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
                    Update your password. After saving, you&apos; ll be logged
                    out.
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
              <Confirm2FA session={session}>
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
      <AccountCard>
        <AccountCardContent>
          <AccountCardTitle>
            <span>Recovery codes</span>
            {recoveryCodesLength > 0 && (
              <Badge
                className="ml-2"
                variant={recoveryCodesLength > 2 ? "default" : "destructive"}
              >
                {recoveryCodesLength}
              </Badge>
            )}
          </AccountCardTitle>
          <AccountCardDescription>
            These codes can be used to regain access to your account if your
            two-factor authentication device is lost.
          </AccountCardDescription>
        </AccountCardContent>
        <AccountCardFooter>
          <AccountCardFooterDescription>
            {recoveryCodesLength === 0 && !user.is2FAEnabled
              ? "You have not enabled two-factor authentication. You can enable it to generate recovery codes."
              : "Generate a new set of recovery codes. You can use these codes to regain access to your account if your two-factor authentication device is lost."}
          </AccountCardFooterDescription>

          <Dialog>
            <DialogTrigger asChild disabled={!user.is2FAEnabled}>
              <Button size="sm">
                {!user.is2FAEnabled
                  ? "Enable 2FA first"
                  : "Generate new recovery codes"}
              </Button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <Confirm2FA session={session}>
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-xl">
                    Generate new recovery codes
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Store these codes in a secure password manager. If your
                    two-factor authentication device is lost, these codes can be
                    used to regain access to your account.
                  </DialogDescription>
                </DialogHeader>
                <GenerateRecoveryCodes />
              </Confirm2FA>
            </DialogPortal>
          </Dialog>
        </AccountCardFooter>
      </AccountCard>
      <AccountCard>
        <AccountCardContent>
          <AccountCardTitle>
            <span>Session</span>
          </AccountCardTitle>
          <AccountCardDescription>
            This is a list of devices that have logged into your account. Revoke
            any sessions that you do not recognize.
          </AccountCardDescription>
          <div className="flex flex-col divide-y rounded-md border">
            {sessions.map(
              ({ id, browser, operatingSystem, device, ip, updatedAt }) => (
                <div
                  key={id}
                  className="relative flex flex-col gap-2 px-7 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      {device === "mobile" ? (
                        <Smartphone className="size-6" />
                      ) : (
                        <Laptop className="size-6" />
                      )}
                      <span className="font-bold">
                        {browser} on {operatingSystem}
                      </span>
                    </div>
                    {id === session.id && (
                      <Badge variant="secondary" className="size-fit">
                        This device
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">{ip}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(updatedAt, {
                        addSuffix: true,
                        includeSeconds: true,
                      })}
                    </span>
                  </div>
                  {id !== session.id && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute bottom-4 right-4 size-fit w-fit p-2 sm:top-4"
                        >
                          <span className="hidden sm:flex">Revoke session</span>
                          <span className="flex sm:hidden">
                            <CircleX />
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogPortal>
                        <DialogOverlay />
                        <Confirm2FA session={session}>
                          <DialogHeader className="space-y-4">
                            <DialogTitle className="text-xl">
                              Revoke session
                            </DialogTitle>
                            <DialogDescription className="text-base">
                              Are you sure you want to revoke this session? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <RevokeSessionBtn sessionId={id} />
                        </Confirm2FA>
                      </DialogPortal>
                    </Dialog>
                  )}
                </div>
              ),
            )}
          </div>
        </AccountCardContent>
      </AccountCard>
    </>
  );
}
