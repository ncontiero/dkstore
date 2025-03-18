import { Link } from "@react-email/components";
import { Layout } from "../components/layout";
import { Text } from "../components/text";
import { getFirstName, render, SITE_BASEURL, SITE_NAME } from "../utils";

export interface WelcomeEmailProps {
  readonly fullName: string;
}

export function WelcomeEmail({ fullName }: WelcomeEmailProps) {
  const firstName = getFirstName(fullName);
  const title = `Welcome to ${SITE_NAME}!`;
  const text = `Hello ${firstName}, welcome to ${SITE_NAME}! We hope you enjoy your experience with us.`;

  return (
    <Layout firstName={firstName} title={title} previewText={text}>
      <Text>
        We are so happy to welcome you to {SITE_NAME}!
        <br />
        <br />
        At {SITE_NAME}, you will find a wide variety of products. Our goal is to
        provide the best shopping experience and help you find exactly what you
        need for your needs.
        <br />
        <br />
        To get started, we invite you to explore{" "}
        <Link href={SITE_BASEURL} target="_blank">
          our website
        </Link>{" "}
        and check out our special offers. Plus, as a way of thanking you for
        joining us, we&apos;re offering a discount of{" "}
        <span className="text-[#ff0000]">10% </span>
        on your first purchase! Just use the code{" "}
        <span className="text-[#ff0000]">WELCOME10</span> at checkout.
        <br />
        <br />
        If you need any assistance or have any questions, our support team is
        available to help. You can contact us by email at support@dkstore.com or
        by phone at (XX) XXXX-XXXX.
        <br />
        <br />
        Thank you for choosing {SITE_NAME}.
      </Text>
    </Layout>
  );
}

export async function renderWelcomeEmail(props: WelcomeEmailProps) {
  return await render(<WelcomeEmail {...props} />);
}

// eslint-disable-next-line import/no-default-export
export default WelcomeEmail;
