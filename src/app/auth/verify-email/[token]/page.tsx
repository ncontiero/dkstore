import { Link } from "@/components/ui/Link";
import { prisma } from "@/lib/prisma";

type PageProps = {
  readonly params: Promise<{ token: string }>;
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
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-base font-medium text-foreground">
          The email verification link is invalid or expired.
        </p>
        <p>
          Request a new link on the{" "}
          <Link href="/account" className="text-primary">
            my account page.
          </Link>
        </p>
      </div>
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
    <p className="mt-4 text-base font-medium text-foreground">
      Your email has been successfully verified. You can close this page.
    </p>
  );
}
