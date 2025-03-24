import type { User, UserWithRecoveryCodes } from "@/utils/types";
import { type User as PrismaUser, prisma } from "@dkstore/db";
import { getSession } from "./session";

interface GetUserProps {
  includePass?: boolean;
  includeRecoveryCodes?: boolean;
}

type GetUserReturnType<T extends GetUserProps> = T["includePass"] extends true
  ? T["includeRecoveryCodes"] extends true
    ? (PrismaUser & UserWithRecoveryCodes) | null
    : PrismaUser | null
  : T["includeRecoveryCodes"] extends true
    ? (User & UserWithRecoveryCodes) | null
    : User | null;

export async function getUser<T extends GetUserProps>({
  includePass = false,
  includeRecoveryCodes = false,
}: T): Promise<GetUserReturnType<T>> {
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
    include: { recoveryCodes: includeRecoveryCodes },
  });

  if (!user) {
    return null;
  }

  return user as unknown as GetUserReturnType<T>;
}
