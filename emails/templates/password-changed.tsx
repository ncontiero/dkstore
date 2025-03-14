import { Layout } from "../components/layout";
import { Text } from "../components/text";
import { getFirstName, render } from "../utils";

export interface PasswordChangedEmailProps {
  readonly fullName: string;
}

export function PasswordChangedEmail({ fullName }: PasswordChangedEmailProps) {
  const firstName = getFirstName(fullName);
  const title = `Your password has been changed`;
  const text = `Hello ${firstName}, your password has been successfully changed.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        We are writing to confirm that your password has been successfully
        changed.
        <br />
        <br />
        If you did not make this change, please contact our support team
        immediately at support@dkstore.com.
        <br />
        <br />
        To ensure the security of your account, we recommend that you keep your
        password confidential and avoid sharing it with others.
        <br />
        <br />
        If you have any further questions or concerns, please don&apos;t
        hesitate to reach out to us.
      </Text>
    </Layout>
  );
}

export async function renderPasswordChangedEmail(
  props: PasswordChangedEmailProps,
) {
  return await render(<PasswordChangedEmail {...props} />);
}

// eslint-disable-next-line import/no-default-export
export default PasswordChangedEmail;
