import { Suspense } from "react";
import { Loading } from "../Loading";
import { SignInForm } from "./SignInForm";

export const metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInForm />
    </Suspense>
  );
}
