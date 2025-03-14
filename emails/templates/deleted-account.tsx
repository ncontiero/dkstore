import { Layout } from "../components/layout";
import { Text } from "../components/text";
import { getFirstName, render, SITE_NAME } from "../utils";

export interface AccountDeletedEmailProps {
  readonly fullName: string;
}

export function AccountDeletedEmail({ fullName }: AccountDeletedEmailProps) {
  const firstName = getFirstName(fullName);
  const title = `Your account has been deleted`;
  const text = `Hello ${firstName}, your account has been successfully deleted.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        We are writing to confirm that your account has been successfully
        deleted as per your request.
        <br />
        <br />
        Please note that all data associated with your account has been
        permanently removed and cannot be recovered.
        <br />
        <br />
        If you have any questions or believe this action was taken in error,
        please contact our support team at support@dkstore.com.
        <br />
        <br />
        Thank you for being a part of {SITE_NAME}. We hope you consider joining
        us again in the future.
      </Text>
    </Layout>
  );
}

export async function renderAccountDeletedEmail(
  props: AccountDeletedEmailProps,
) {
  return await render(<AccountDeletedEmail {...props} />);
}

// eslint-disable-next-line import/no-default-export
export default AccountDeletedEmail;
