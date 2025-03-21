import { cookies } from "next/headers";
import { env } from "@/env";

export async function getQueueDashboardURL() {
  const sessionCookie = (await cookies()).get("session");

  const dashboardUrl = new URL("/auth/sign-in", env.QUEUE_DASHBOARD_BASEURL);
  dashboardUrl.searchParams.set("token", sessionCookie!.value);

  return dashboardUrl.toString();
}
