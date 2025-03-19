import {
  Column,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { env } from "@/env";

export function Footer() {
  return (
    <Section className="text-center">
      <Hr />
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <Text className="my-[8px] text-[24px] font-semibold leading-[24px] text-gray-900">
              {env.SITE_NAME}
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row className="table-cell h-[44px] w-[56px] align-bottom">
              <Column className="pr-[8px]">
                <Link href={env.SITE_BASEURL}>
                  <Img
                    alt="Facebook"
                    height="36"
                    src="https://react.email/static/facebook-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
              <Column>
                <Link href={env.SITE_BASEURL}>
                  <Img
                    alt="Instagram"
                    height="36"
                    src="https://react.email/static/instagram-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text className="my-[8px] text-[16px] font-semibold leading-[24px] text-gray-500">
              123 Main Street Anytown, CA 12345
            </Text>
            <Text className="mb-0 mt-[4px] text-[16px] font-semibold leading-[24px] text-gray-500">
              support@dkstore.com (XX) XXXX-XXXX
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  );
}
