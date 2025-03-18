import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@dkstore/ui/card";
import { emailSchema } from "@/actions/schema";
import { Loading } from "../../Loading";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type PageProps = {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data: email } = emailSchema.safeParse(params.email);

  return (
    <Suspense fallback={<Loading />}>
      <Card
        title="Forgot password"
        description="Enter your email below to reset your password"
      >
        <ForgotPasswordForm email={email} />
      </Card>
    </Suspense>
  );
}
