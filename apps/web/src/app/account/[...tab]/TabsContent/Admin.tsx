import { Button } from "@dkstore/ui/button";
import Link from "next/link";
import {
  AccountCard,
  AccountCardContent,
  AccountCardDescription,
  AccountCardFooter,
  AccountCardFooterDescription,
  AccountCardTitle,
} from "@/components/Account";
import { getQueueDashboardURL } from "@/utils/queue-dash-url";

export async function Admin() {
  const queueDashboardURL = await getQueueDashboardURL();

  return (
    <AccountCard>
      <AccountCardContent>
        <AccountCardTitle>Queue Dashboard</AccountCardTitle>
        <AccountCardDescription>
          This is queue dashboard. You can manage queues here.
        </AccountCardDescription>
      </AccountCardContent>
      <AccountCardFooter>
        <AccountCardFooterDescription>
          Do not share this link with anyone.
        </AccountCardFooterDescription>
        <Button asChild size="sm">
          <Link href={queueDashboardURL} target="_blank" rel="noreferrer">
            Go to Queue Dashboard
          </Link>
        </Button>
      </AccountCardFooter>
    </AccountCard>
  );
}
