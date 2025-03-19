import { Link } from "@react-email/components";
import { Layout } from "@/components/layout";
import { Text } from "@/components/text";
import { absoluteUrl, getFirstName, render } from "@/utils";

export interface ChangeEmailProps {
  readonly fullName: string;
  readonly changeEmailPath: string;
}

export function ChangeEmail({
  fullName,
  changeEmailPath = "auth/email/123/change",
}: ChangeEmailProps) {
  const changeEmailLink = absoluteUrl(changeEmailPath);
  const firstName = getFirstName(fullName);
  const title = `Change your email address`;
  const text = `Hello ${firstName}, click the link to change your account email!`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>Click the link below to change your account email!</Text>
      <Link href={changeEmailLink} target="_blank">
        Change email
      </Link>
      <Text className="text-[14px] text-[#666666]">
        If you did not request an email change, please ignore this email.
      </Text>
    </Layout>
  );
}

export async function renderChangeEmail(props: ChangeEmailProps) {
  return await render(<ChangeEmail {...props} />);
}

export default ChangeEmail;
