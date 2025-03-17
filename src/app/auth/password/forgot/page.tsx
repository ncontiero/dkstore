import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="xs:px-4 mt-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-md border px-3 py-6 sm:rounded-md sm:p-6">
        <div className="flex flex-col items-center justify-center space-y-1 text-center">
          <h2 className="text-3xl font-bold">Forgot password</h2>
          <p className="text-base font-medium text-foreground/60">
            Enter your email below to reset your password
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
