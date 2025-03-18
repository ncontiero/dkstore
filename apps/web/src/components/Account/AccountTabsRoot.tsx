"use client";

import type { PropsWithChildren } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { Tabs } from "@/components/ui/Tabs";

export function AccountTabsRoot({
  children,
  defaultTab,
  tabParam,
}: PropsWithChildren<{
  readonly tabParam?: string;
  readonly defaultTab: string;
}>) {
  const { width } = useWindowSize();

  return (
    <Tabs
      defaultValue={tabParam ?? defaultTab}
      value={tabParam}
      orientation={width && width < 768 ? "horizontal" : "vertical"}
      className="flex flex-col gap-4 md:flex-row"
    >
      {children}
    </Tabs>
  );
}
