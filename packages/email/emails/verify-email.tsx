import { Link } from "@react-email/components";
import { Layout } from "../components/layout";
import { Text } from "../components/text";
import { absoluteUrl, env, getFirstName, render } from "../utils";

export interface VerifyEmailProps {
  readonly fullName: string;
  readonly verificationPath: string;
}

export function VerifyEmail({
  fullName,
  verificationPath = "auth/email/123/verify",
}: VerifyEmailProps) {
  const verificationLink = absoluteUrl(verificationPath);
  const firstName = getFirstName(fullName);
  const title = `Verify your email address`;
  const text = `Hello ${firstName}, check your email to activate your ${env.SITE_NAME} account!`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>Check your email to activate your {env.SITE_NAME} account!</Text>
      <Link href={verificationLink} target="_blank">
        Click here to verify your email.
      </Link>
      <Text className="text-[14px] text-[#666666]">
        If you did not request verification, please ignore this email.
      </Text>
    </Layout>
  );
}

export async function renderVerifyEmail(props: VerifyEmailProps) {
  return await render(<VerifyEmail {...props} />);
}

export default VerifyEmail;
