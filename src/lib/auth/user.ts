import type { User as PrismaUser } from "@prisma/client";
import type { User } from "@/utils/types";
import { prisma } from "../prisma";
import { getSession } from "./session";

interface GetUserProps {
  includePass?: boolean;
}

export async function getUser<T extends GetUserProps>({
  includePass = false,
}: T): Promise<
  T["includePass"] extends true ? PrismaUser | null : User | null
> {
  const session = await getSession();
  if (!session || !session.user || typeof session.user.id !== "string") {
    return null;
  }

  if (new Date(session.expires) < new Date()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    omit: { passwordHash: !includePass },
  });

  if (!user) {
    return null;
  }

  return user;
}
