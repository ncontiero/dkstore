import { Layout } from "@/components/layout";
import { Text } from "@/components/text";
import { getFirstName, render } from "@/utils";

export interface RecoveryCodesGeneratedEmailProps {
  readonly fullName: string;
}

export function RecoveryCodesGeneratedEmail({
  fullName,
}: RecoveryCodesGeneratedEmailProps) {
  const firstName = getFirstName(fullName);
  const title = "New 2FA Recovery Codes Generated";
  const text = `Hello ${firstName}, new 2FA recovery codes have been generated for your account.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        New two-factor authentication recovery codes have been generated for
        your account.
        <br />
        <br />
        Please store these codes in a safe place. If you lose access to your 2FA
        device, you can use these codes to recover your account.
        <br />
        <br />
        If you did not request these codes, please contact our support team
        immediately at support@dkstore.com.
      </Text>
    </Layout>
  );
}

export async function renderRecoveryCodesGeneratedEmail(
  props: RecoveryCodesGeneratedEmailProps,
) {
  return await render(<RecoveryCodesGeneratedEmail {...props} />);
}

export default RecoveryCodesGeneratedEmail;
