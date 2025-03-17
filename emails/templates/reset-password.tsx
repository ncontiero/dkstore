import { Link } from "@react-email/components";
import { Layout } from "../components/layout";
import { Text } from "../components/text";
import { absoluteUrl, getFirstName, render } from "../utils";

export interface ResetPasswordEmailProps {
  readonly fullName: string;
  readonly resetPasswordPath: string;
}

export function ResetPasswordEmail({
  fullName,
  resetPasswordPath = "auth/password/123/reset",
}: ResetPasswordEmailProps) {
  const resetPasswordLink = absoluteUrl(resetPasswordPath);
  const firstName = getFirstName(fullName);
  const title = `Reset your password`;
  const text = `Hello ${firstName}, click the link to reset your password!`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>Click the link below to reset your password!</Text>
      <Link href={resetPasswordLink} target="_blank">
        Reset password
      </Link>
      <Text className="text-[14px] text-[#666666]">
        If you did not request a password reset, please ignore this email.
      </Text>
    </Layout>
  );
}

export async function renderResetPasswordEmail(props: ResetPasswordEmailProps) {
  return await render(<ResetPasswordEmail {...props} />);
}

// eslint-disable-next-line import/no-default-export
export default ResetPasswordEmail;
