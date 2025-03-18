import type { Metadata } from "next";
import { Card } from "@dkstore/ui/card";
import { Link } from "@dkstore/ui/link";
import { prisma } from "@/lib/prisma";

type PageProps = {
  readonly params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Email Verification",
};

export default async function VerifyEmailPage({ params }: PageProps) {
  const { token } = await params;

  const existingToken = await prisma.token.findUnique({
    where: { id: token },
  });

  if (
    !existingToken ||
    existingToken.expires < new Date() ||
    existingToken.type !== "EMAIL_VERIFICATION"
  ) {
    return (
      <Card>
        <p className="mt-4 text-center">
          Request a new link on the{" "}
          <Link href="/account/data" className="text-primary">
            my account page.
          </Link>
        </p>
      </Card>
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: existingToken.userId },
      data: { isEmailVerified: true },
    });
    await tx.token.delete({ where: { id: existingToken.id } });
  });

  return (
    <Card
      title="Email Verification"
      description="Your email has been successfully verified. You can close this page."
    />
  );
}
