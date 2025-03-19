import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@dkstore/db";
import { Card } from "@dkstore/ui/card";
import { Link } from "@dkstore/ui/link";
import { Loading } from "@/app/auth/Loading";
import { getUser } from "@/lib/auth/user";
import { ResetPasswordForm } from "./ResetPasswordForm";

type PageProps = {
  readonly params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Reset your password",
};

export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = await params;

  const user = await getUser({});
  const existingToken = await prisma.token.findUnique({
    where: { id: token },
  });

  if (
    !existingToken ||
    existingToken.expires < new Date() ||
    existingToken.type !== "RESET_PASSWORD"
  ) {
    return (
      <Card>
        <p className="mt-4 text-center">
          Request a new link on the{" "}
          <Link
            href={`/auth/password/forgot${user ? `?email=${user.email}` : ""}`}
            className="text-primary"
          >
            forgot password page.
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Card
        title="Reset password"
        description="Enter your new password below to reset your password"
      >
        <ResetPasswordForm userId={existingToken.userId} />
      </Card>
    </Suspense>
  );
}
