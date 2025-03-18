import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@dkstore/ui/card";
import { Link } from "@dkstore/ui/link";
import { Loading } from "@/app/auth/Loading";
import { prisma } from "@/lib/prisma";
import { UpdateEmailForm } from "./UpdateEmailForm";

type PageProps = {
  readonly params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Change your email",
};

export default async function ChangeEmailPage({ params }: PageProps) {
  const { token } = await params;

  const existingToken = await prisma.token.findUnique({
    where: { id: token },
  });

  if (
    !existingToken ||
    existingToken.expires < new Date() ||
    existingToken.type !== "CHANGE_EMAIL"
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

  return (
    <Suspense fallback={<Loading />}>
      <Card
        title="Change your email"
        description="Enter your new email below to change your email."
      >
        <UpdateEmailForm />
      </Card>
    </Suspense>
  );
}
