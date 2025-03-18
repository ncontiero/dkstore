import type { Metadata } from "next";
import type { User as UserProps } from "@/utils/types";
import { Suspense } from "react";
import { ScrollArea, ScrollBar } from "@dkstore/ui/scroll-area";
import { Separator } from "@dkstore/ui/separator";
import { TabsContent, TabsList, TabsTrigger } from "@dkstore/ui/tabs";
import { BookHeart, Lock, MapPin, ShoppingBasket, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountTabsRoot } from "@/components/Account";
import { getUser } from "@/lib/auth/user";
import { AccountDetails } from "./TabsContent/AccountDetails";
import { AccountSecurity } from "./TabsContent/AccountSecurity";

type PageProps = {
  readonly params: Promise<{ tab: string[] }>;
};

const tabs = [
  {
    name: "Your account details",
    value: "data",
    description: "Data that represents you in the store.",
    icon: User,
    content: (user: UserProps) => <AccountDetails user={user} />,
  },
  {
    name: "Security",
    value: "security",
    description: "Security settings for your account.",
    icon: Lock,
    content: (user: UserProps) => <AccountSecurity user={user} />,
  },
  {
    name: "Your addresses",
    value: "addresses",
    description: "Addresses that you have registered in the store.",
    icon: MapPin,
    content: (user: UserProps) => <AccountDetails user={user} />,
  },
  {
    name: "Your orders",
    value: "orders",
    description: "Orders that you have made in the store.",
    icon: ShoppingBasket,
    content: (user: UserProps) => <AccountDetails user={user} />,
  },
  {
    name: "Your favorites",
    description: "Products you have added to your favorites in the store.",
    value: "favorites",
    icon: BookHeart,
    content: (user: UserProps) => <AccountDetails user={user} />,
  },
];

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const tab = (await params).tab[0];
  const tabData = tabs.find((t) => t.value === tab);

  return {
    title: tabData?.name || "Account",
  };
}

export default async function AccountPage({ params }: PageProps) {
  const tabsParam = (await params).tab;
  const tabParam = tabsParam[0];
  const defaultTab = tabs[0]!.value;

  if (tabsParam.length > 1 || !tabs.some((tab) => tab.value === tabParam)) {
    redirect(`/account/${defaultTab}`);
  }

  const user = await getUser({});
  if (!user) return null;

  return (
    <main className="mx-auto my-10 flex max-w-5xl flex-col gap-4 px-2 md:px-0">
      <h1 className="text-3xl font-bold">Account Settings</h1>
      <Separator className="mt-3 md:mt-6" />
      <Suspense fallback={<div>Loading...</div>}>
        <AccountTabsRoot defaultTab={defaultTab} tabParam={tabParam}>
          <ScrollArea className="w-full pb-2 md:w-1/4">
            <TabsList className="w-full gap-1 bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  asChild
                  className="duration-100 hover:bg-secondary/80 data-[state=active]:bg-secondary data-[state=active]:hover:bg-secondary/80"
                >
                  <Link href={`/account/${tab.value}`}>
                    <tab.icon className="mr-2 size-4" />
                    {tab.name}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-0 w-full rounded-md"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">{tab.name}</h2>
                <p className="text-foreground/80">{tab.description}</p>
              </div>
              {tab.content(user)}
            </TabsContent>
          ))}
        </AccountTabsRoot>
      </Suspense>
    </main>
  );
}
