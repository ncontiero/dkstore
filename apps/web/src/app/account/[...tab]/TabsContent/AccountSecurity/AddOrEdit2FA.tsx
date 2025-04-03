"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { CopyButton } from "@dkstore/ui/copy-button";
import { DialogClose } from "@dkstore/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@dkstore/ui/input-otp";
import { Label } from "@dkstore/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import QRCode from "qrcode";
import speakeasy, { type GeneratedSecret } from "speakeasy";
import { addOrEdit2FAAction } from "@/actions/account";
import {
  type AddOrEdit2FASchema,
  addOrEdit2FASchema,
} from "@/actions/account/schema";
import { env } from "@/env";

export function AddOrEdit2FA({
  is2FAEnabled,
}: {
  readonly is2FAEnabled: boolean;
}) {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const addOrEdit2FA = useAction(addOrEdit2FAAction, {
    onError: (args) => {
      toast.error(args.error.serverError);
    },
    onSuccess: (args) => {
      toast.success(`2FA ${is2FAEnabled ? "edited" : "added"} successfully`);
      if (args.data && args.data.length > 0) {
        setRecoveryCodes(args.data);
        return;
      }
      closeDialogRef.current?.click();
    },
  });

  const [otpSecret, setOtpSecret] = useState<GeneratedSecret | undefined>(
    undefined,
  );
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [unableToScan, setUnableToScan] = useState(false);

  const form = useForm({
    resolver: zodResolver(addOrEdit2FASchema),
    defaultValues: {
      code: "",
      secret: otpSecret?.base32 || "",
    },
  });

  const generateQrCode = useCallback(async (optAuthUrl?: string) => {
    if (!optAuthUrl) return;
    setQrCode(await QRCode.toDataURL(optAuthUrl));
  }, []);

  function onSubmit(values: AddOrEdit2FASchema) {
    addOrEdit2FA.execute({
      code: values.code,
      secret: otpSecret!.base32,
    });
  }

  useEffect(() => {
    const secret = speakeasy.generateSecret({
      name: env.NEXT_PUBLIC_SITE_NAME,
    });

    setOtpSecret(secret);
    generateQrCode(secret.otpauth_url);
    form.setValue("secret", secret.base32);
  }, [form, generateQrCode]);

  return (
    <div className="flex flex-col gap-2">
      {recoveryCodes.length > 0 ? (
        <div>
          <p className="my-4 text-base font-bold">Backup codes</p>
          <p className="text-sm text-foreground/80">
            Save these backup codes in a safe place. You can use them to recover
            your account if you lose your device.
          </p>
          <div className="my-4 rounded-md border">
            <div className="grid grid-cols-2 gap-2 px-7 py-4">
              {recoveryCodes.map((code) => (
                <div key={code} className="text-center text-sm">
                  {code}
                </div>
              ))}
            </div>
            <CopyButton
              valueToCopy={recoveryCodes.join(" ")}
              className="w-full gap-2 rounded-t-none border-t-2 border-border"
            >
              Copy all codes
            </CopyButton>
          </div>
          <div className="flex w-full justify-end">
            <DialogClose asChild>
              <Button type="button" size="sm">
                Finish
              </Button>
            </DialogClose>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground/80">
            Use an authenticator app or browser extension{" "}
            <span className="font-bold">
              {unableToScan ? "to add the secret key" : "to scan the QR code"}.
            </span>
          </p>
          <div className="my-4">
            {unableToScan ? (
              <div className="text-sm text-foreground/80">
                <p>
                  Make sure Time-based or One-time passwords is enabled, then
                  finish linking your account.
                </p>
                <div className="mt-2 flex items-center rounded-md border">
                  <input
                    type="text"
                    value={otpSecret?.base32}
                    contentEditable={false}
                    className="size-full rounded-md bg-transparent p-3 focus-visible:outline-none"
                    readOnly
                  />
                  <CopyButton valueToCopy={otpSecret!.base32} />
                </div>
                <p className="mt-4">
                  Alternatively, if your authenticator supports TOTP URIs, you
                  can also copy the full URI.
                </p>
                <div className="mt-2 flex items-center rounded-md border">
                  <input
                    type="text"
                    value={otpSecret?.otpauth_url}
                    contentEditable={false}
                    className="size-full rounded-md bg-transparent p-3 focus-visible:outline-none"
                    readOnly
                  />
                  <CopyButton valueToCopy={otpSecret!.otpauth_url!} />
                </div>
              </div>
            ) : !qrCode ? (
              <div className="size-[200px] animate-pulse rounded-md bg-secondary" />
            ) : (
              <Image
                src={qrCode}
                width={200}
                height={200}
                alt="QR Code for authenticator app"
                className="rounded-md"
              />
            )}
          </div>
          <Button
            type="button"
            variant="link"
            className="size-fit p-0 text-sm"
            onClick={() => setUnableToScan(!unableToScan)}
          >
            {unableToScan ? "Scan QR code instead" : "Can’t scan QR code?"}
          </Button>
          <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <Label htmlFor="code">Verify the code from the app</Label>
              <InputOTP
                maxLength={6}
                name="code"
                id="code"
                pattern={"^\\d+$"}
                containerClassName="w-fit"
                onChange={(value) => form.setValue("code", value)}
              >
                <InputOTPGroup className="gap-1">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      index={index}
                      className="rounded-md border-2"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {form.formState.errors.code ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.code.message}
                </p>
              ) : null}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={addOrEdit2FA.status === "executing"}
              >
                {addOrEdit2FA.status === "executing" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <DialogClose asChild ref={closeDialogRef}>
                <Button type="button" variant="secondary" size="sm">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
