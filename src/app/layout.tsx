import "react-toastify/dist/ReactToastify.min.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { env } from "@/env";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const meta = {
  title: env.SITE_NAME,
  description: "An e-commerce with Next.js.",
};
export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_BASEURL),
  title: {
    default: meta.title,
    template: `%s • ${meta.title}`,
  },
  description: meta.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: {
      default: meta.title,
      template: `%s • ${meta.title}`,
    },
    description: meta.description,
    siteName: meta.title,
    type: "website",
    url: "/",
    locale: env.SITE_LOCALE,
  },
  twitter: {
    title: {
      default: meta.title,
      template: `%s • ${meta.title}`,
    },
    description: meta.description,
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ToastContainer
          autoClose={3000}
          theme="dark"
          newestOnTop
          pauseOnFocusLoss={false}
          limit={3}
          closeOnClick
          stacked
        />
        <Header />
        <div className="pb-20 pt-[72px]">{children}</div>
      </body>
    </html>
  );
}
