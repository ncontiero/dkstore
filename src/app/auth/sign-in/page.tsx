import { Suspense } from "react";
import { LoadingForm } from "../LoadingForm";
import { SignInForm } from "./SignInForm";

export const metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<LoadingForm />}>
      <SignInForm />
    </Suspense>
  );
}
