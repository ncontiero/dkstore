import { Layout } from "@/components/layout";
import { Text } from "@/components/text";
import { getFirstName, render } from "@/utils";

export interface AccountAccessedWithRecoveryCodeEmailProps {
  readonly fullName: string;
  readonly ipAddress: string;
  readonly accessedAt: string;
  readonly device: string;
}

export function AccountAccessedWithRecoveryCodeEmail({
  fullName,
  ipAddress = "123",
  accessedAt = new Date().toLocaleString(),
  device = "Chrome on Windows",
}: AccountAccessedWithRecoveryCodeEmailProps) {
  const firstName = getFirstName(fullName);
  const title = "Account Access with Recovery Code";
  const text = `Hello ${firstName}, your account was accessed using a recovery code.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        Your account was accessed using a recovery code with the following
        details:
        <br />
        <br />
        <span className="block">
          <span className="font-bold">IP Address: </span>
          {ipAddress}
        </span>
        <span className="block">
          <span className="font-bold">Time: </span>
          {accessedAt}
        </span>
        <span className="block">
          <span className="font-bold">Device: </span>
          {device}
        </span>
        <br />
        This indicates that one of your recovery codes was used to access your
        account.
        <br />
        <br />
        If you did not authorize this access, we strongly recommend that you
        take the following steps immediately:
        <br />
        <br />
        1. Change your password immediately.
        <br />
        2. Generate new recovery codes and store them securely.
        <br />
        3. Review the devices connected to your account and disconnect any
        unknown devices.
        <br />
        4. Enable two-factor authentication (2FA) if it is not already enabled.
        <br />
        <br />
        If you recognize this access, you can ignore this message.
        <br />
        <br />
        If you have any questions or need assistance, please contact our support
        at support@dkstore.com.
      </Text>
    </Layout>
  );
}

export async function renderAccountAccessedWithRecoveryCodeEmail(
  props: AccountAccessedWithRecoveryCodeEmailProps,
) {
  return await render(<AccountAccessedWithRecoveryCodeEmail {...props} />);
}

export default AccountAccessedWithRecoveryCodeEmail;
