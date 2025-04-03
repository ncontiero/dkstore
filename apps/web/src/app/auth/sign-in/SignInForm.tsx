"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@dkstore/ui/button";
import { Input } from "@dkstore/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@dkstore/ui/input-otp";
import { Label } from "@dkstore/ui/label";
import { Link } from "@dkstore/ui/link";
import { PasswordInput } from "@dkstore/ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { signInAction } from "@/actions/auth";
import { type SignInSchema, signInSchema } from "@/actions/auth/schema";
import { BaseAuthFormContainer } from "../BaseFormContainer";

export function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isUseRecoveryCode, setIsUseRecoveryCode] = useState(false);

  const signIn = useAction(signInAction, {
    onError: (error) => {
      toast.error(error.error.serverError);
    },
    onSuccess: (args) => {
      setIs2FAEnabled(args.data?.twoFactor || false);
    },
  });

  const form = useForm({
    resolver: zodResolver(signInSchema),
  });

  function onSubmit(data: SignInSchema) {
    signIn.execute({ ...data, redirectTo });
  }

  useEffect(() => {
    if (redirectTo?.includes("redirect=queue-dashboard")) {
      toast.error("Log in to your admin account to access this page.");
    }
  }, [redirectTo]);

  return (
    <BaseAuthFormContainer
      mode={
        isUseRecoveryCode ? "recoveryCode" : is2FAEnabled ? "2fa" : "signin"
      }
      redirectTo={redirectTo}
    >
      <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
        {isUseRecoveryCode ? (
          <div className="space-y-1">
            <Label htmlFor="recoveryCode">Recovery code</Label>
            <Input
              type="text"
              id="recoveryCode"
              placeholder="Enter your recovery code"
              {...form.register("recoveryCode")}
            />

            {form.formState.errors.recoveryCode ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.recoveryCode.message}
              </p>
            ) : null}
          </div>
        ) : is2FAEnabled ? (
          <div className="flex flex-col items-center gap-2">
            <Label htmlFor="otpCode">OTP Code</Label>
            <InputOTP
              maxLength={6}
              name="otpCode"
              id="otpCode"
              pattern={"^\\d+$"}
              containerClassName="w-fit"
              onChange={(value) => form.setValue("otpCode", value)}
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

            {form.formState.errors.otpCode ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.otpCode.message}
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...form.register("email")}
              />

              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="mt-6 space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/password/forgot" size="sm" variant="default">
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...form.register("password")}
              />

              {form.formState.errors.password ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>
          </>
        )}

        <Button type="submit" className="mt-6 w-full rounded-full">
          {signIn.status === "executing" ? (
            <Loader className="animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
        {is2FAEnabled ? (
          <div className="mt-3 flex w-full justify-center">
            <Button
              type="button"
              variant="link"
              className="size-fit p-0"
              onClick={() => setIsUseRecoveryCode(!isUseRecoveryCode)}
            >
              {isUseRecoveryCode
                ? "Use OTP code instead"
                : "Use recovery code instead"}
            </Button>
          </div>
        ) : null}
      </form>
    </BaseAuthFormContainer>
  );
}
