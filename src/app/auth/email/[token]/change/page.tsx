import type { Metadata } from "next";
import { Link } from "@/components/ui/Link";
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
      <div className="xs:px-4 mt-16 flex flex-col items-center justify-center">
        <div className="xs:rounded-md w-full max-w-lg border px-3 py-6 text-center sm:p-6">
          <h2 className="text-3xl font-bold">Invalid link</h2>
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-base font-medium text-foreground">
              The link you clicked is invalid or expired.
            </p>
            <p>
              Request a new link on the{" "}
              <Link href="/account/data" className="text-primary">
                my account page.
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="xs:px-4 mt-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-md border px-3 py-6 sm:rounded-md sm:p-6">
        <div className="flex flex-col items-center justify-center space-y-1 text-center">
          <h2 className="text-3xl font-bold">Change your email</h2>
          <p className="text-base font-medium text-foreground/60">
            Enter your new email below to change your email.
          </p>
        </div>

        <UpdateEmailForm />
      </div>
    </div>
  );
}
