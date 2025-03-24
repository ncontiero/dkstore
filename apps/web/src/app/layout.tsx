import "@dkstore/ui/globals.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { env } from "@/env";
import { SessionProvider } from "@/lib/auth";
import { getSession } from "@/lib/auth/db";

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

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getSession({});

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            <ToastContainer
              autoClose={3000}
              theme="dark"
              newestOnTop
              pauseOnFocusLoss={false}
              limit={3}
              closeOnClick
              stacked
              className="z-[999999] bg-background font-inter text-foreground"
              toastClassName="bg-background text-foreground"
            />
            <Header />
            <div className="md:container">{children}</div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
