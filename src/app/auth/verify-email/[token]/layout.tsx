import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Email Verification",
};

export default function VerifyEmailLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className="xs:px-4 mt-16 flex flex-col items-center justify-center">
      <div className="xs:rounded-md w-full max-w-lg border px-3 py-6 text-center sm:p-6">
        <h2 className="text-3xl font-bold">Email Verification</h2>
        {children}
      </div>
    </div>
  );
}
