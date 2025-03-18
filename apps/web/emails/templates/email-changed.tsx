import { Layout } from "../components/layout";
import { Text } from "../components/text";
import { getFirstName, render } from "../utils";

export interface EmailChangedEmailProps {
  readonly fullName: string;
  readonly newEmail: string;
}

export function EmailChangedEmail({
  fullName,
  newEmail,
}: EmailChangedEmailProps) {
  const firstName = getFirstName(fullName);
  const title = `Your email address has been changed`;
  const text = `Hello ${firstName}, your email address has been successfully changed to ${newEmail}.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        We are writing to confirm that your email address has been successfully
        changed to:
        <br />
        <br />
        <strong>{newEmail}</strong>
        <br />
        <br />
        If you did not make this change, please contact our support team
        immediately at support@dkstore.com.
        <br />
        <br />
        To ensure the security of your account, we recommend that you keep your
        login credentials confidential and avoid sharing them with others.
        <br />
        <br />
        If you have any further questions or concerns, please don&apos;t
        hesitate to reach out to us.
      </Text>
    </Layout>
  );
}

export async function renderEmailChangedEmail(props: EmailChangedEmailProps) {
  return await render(<EmailChangedEmail {...props} />);
}

// eslint-disable-next-line import/no-default-export
export default EmailChangedEmail;
