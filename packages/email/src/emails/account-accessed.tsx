import { Layout } from "@/components/layout";
import { Text } from "@/components/text";
import { getFirstName, render } from "@/utils";

export interface AccountAccessedEmailProps {
  readonly fullName: string;
  readonly ipAddress: string;
  readonly accessedAt: string;
  readonly device: string;
}

export function AccountAccessedEmail({
  fullName,
  ipAddress = "123",
  accessedAt = new Date().toLocaleString(),
  device = "Chrome on Windows",
}: AccountAccessedEmailProps) {
  const firstName = getFirstName(fullName);
  const title = "Account Access Notification";
  const text = `Hello ${firstName}, your account was accessed.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        Your account was accessed with the following details:
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
        If you did not authorize this access, we recommend that you take the
        following steps immediately:
        <br />
        <br />
        1. Change your password immediately.
        <br />
        2. Check your security settings and enable two-factor authentication
        (2FA) if it is not already enabled.
        <br />
        3. Review the devices connected to your account and disconnect any
        unknown devices.
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

export async function renderAccountAccessedEmail(
  props: AccountAccessedEmailProps,
) {
  return await render(<AccountAccessedEmail {...props} />);
}

export default AccountAccessedEmail;
