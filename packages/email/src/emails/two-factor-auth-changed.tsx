import { Layout } from "@/components/layout";
import { Text } from "@/components/text";
import { getFirstName, render } from "@/utils";

export interface TwoFactorAuthChangedEmailProps {
  readonly fullName: string;
  readonly action: "added" | "edited";
}

export function TwoFactorAuthChangedEmail({
  fullName,
  action,
}: TwoFactorAuthChangedEmailProps) {
  const firstName = getFirstName(fullName);
  const title = `Your 2FA method has been ${action}`;
  const text = `Hello ${firstName}, your 2FA method has been successfully ${action}.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        We are writing to confirm that your two-factor authentication method has
        been successfully <strong>{action}</strong>.
        <br />
        <br />
        If you did not make this change, please contact our support team
        immediately at support@dkstore.com.
        <br />
        <br />
        To ensure the security of your account, we recommend that you keep your
        authentication methods confidential and avoid sharing any codes or
        backup methods with others.
        <br />
        <br />
        If you have any further questions or concerns, please don&apos;t
        hesitate to reach out to us.
      </Text>
    </Layout>
  );
}

export async function renderTwoFactorAuthChangedEmail(
  props: TwoFactorAuthChangedEmailProps,
) {
  return await render(<TwoFactorAuthChangedEmail {...props} />);
}

export default TwoFactorAuthChangedEmail;
