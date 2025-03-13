import type { PropsWithChildren } from "react";
import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { SITE_NAME } from "../utils";
import { Footer } from "./footer";
import { Text } from "./text";

export interface LayoutProps extends PropsWithChildren {
  readonly firstName: string;
  readonly previewText: string;
  readonly title?: string;
}

export function Layout({
  firstName,
  title,
  previewText,
  children,
}: LayoutProps) {
  return (
    <Html>
      <Tailwind>
        <Head>
          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.2.5/files/geist-sans-latin-400-normal.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />

          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.2.5/files/geist-sans-latin-500-normal.woff2",
              format: "woff2",
            }}
            fontWeight={500}
            fontStyle="normal"
          />

          <Font
            fontFamily="Geist"
            fallbackFontFamily="Helvetica"
            webFont={{
              url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.2.5/files/geist-sans-latin-600-normal.woff2",
              format: "woff2",
            }}
            fontWeight={600}
            fontStyle="normal"
          />
        </Head>
        <Preview>{previewText}</Preview>

        <Body className="m-auto bg-[#fff] font-sans">
          <Container
            className="mx-auto my-[40px] max-w-[600px] border-transparent p-[20px] md:border-[#E8E7E1]"
            style={{ borderStyle: "solid", borderWidth: 1 }}
          >
            {title ? (
              <Heading className="mx-0 my-[30px] p-0 text-center text-[32px] font-bold text-[#121212]">
                {title}
              </Heading>
            ) : null}

            <span className="font-medium">Hello {firstName},</span>
            {children}

            <Text>
              Best regards,
              <br />
              <span className="font-medium">{SITE_NAME} team.</span>
            </Text>

            <br />

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
