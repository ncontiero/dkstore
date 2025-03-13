import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { getUser } from "@/lib/auth/user";
import { PasswordForm } from "./forms/PasswordForm";
import { ProfileForm } from "./forms/ProfileForm";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function ProfilePage() {
  const user = await getUser({});

  if (!user) {
    return null;
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
