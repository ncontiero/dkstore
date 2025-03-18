import { Suspense } from "react";
import { Loading } from "../Loading";
import { SignUpForm } from "./SignUpForm";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignUpForm />
    </Suspense>
  );
}
