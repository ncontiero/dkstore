import "./globals.css";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { env } from "@/env";
import { UserProvider } from "@/lib/auth";
import { getUser } from "@/lib/auth/user";

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
  const user = await getUser({});

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <UserProvider user={user}>
          <ToastContainer
            autoClose={3000}
            theme="dark"
            newestOnTop
            pauseOnFocusLoss={false}
            limit={3}
            closeOnClick
            stacked
            className="z-[99999] font-inter text-foreground"
            toastClassName="bg-background"
          />
          <Header />
          <div className="pt-16 sm:container">{children}</div>
        </UserProvider>
      </body>
    </html>
  );
}
