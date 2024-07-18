import type { Metadata } from "next";
import type { User } from "@/utils/types";

import type { Session } from "@prisma/client";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import { api } from "@/utils/api";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function ProfilePage() {
  const { content } = await api.get<{ user: User; sessions: Session[] }>(
    "getSessions",
    { throwError: false, searchParams: { includeUser: "true" } },
  );
  const { user, sessions } = content?.data || {};
  if (!user) {
    redirect("/api/auth/sign-out");
  }

  return (
    <div className="mx-auto mt-16 flex max-w-2xl flex-col justify-center px-4">
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex flex-col rounded-md border p-6">
            <div>
              <h3 className="text-2xl font-semibold">Profile</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Make changes to your profile here. Click save when you&apos;re
                done.
              </p>
            </div>
            <ProfileForm user={user} />
            <div className="mt-8 flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Manage and revoke your active sessions.
              </p>
              <div className="flex flex-col gap-2">
                {sessions?.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.createdAt).toLocaleTimeString()} - {""}
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <Button type="button" variant="destructive" size="icon">
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="flex flex-col rounded-md border p-6">
            <div>
              <h3 className="text-2xl font-semibold">Password</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Change your password here.
              </p>
            </div>
            <PasswordForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
