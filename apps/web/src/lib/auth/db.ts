import type {
  SessionWhitUser,
  User,
  UserWithRecoveryCodes,
} from "@/utils/types";
import { type User as PrismaUser, prisma } from "@dkstore/db";
import { getSession as getLocalSession } from "./session";

interface GetSessionProps {
  includeUserPass?: boolean;
  includeUserRecoveryCodes?: boolean;
}

type GetSessionReturnUserType<T extends GetSessionProps> =
  T["includeUserPass"] extends true
    ? T["includeUserRecoveryCodes"] extends true
      ? PrismaUser & UserWithRecoveryCodes
      : PrismaUser
    : T["includeUserRecoveryCodes"] extends true
      ? User & UserWithRecoveryCodes
      : User;

export async function getSession<T extends GetSessionProps>({
  includeUserPass = false,
  includeUserRecoveryCodes = false,
}: T): Promise<SessionWhitUser<GetSessionReturnUserType<T>> | null> {
  const sessionJwt = await getLocalSession();
  if (!sessionJwt) return null;

  const session = await prisma.session.findUnique({
    where: {
      id: sessionJwt.id,
    },
    include: {
      user: {
        omit: { passwordHash: !includeUserPass },
        include: { recoveryCodes: includeUserRecoveryCodes },
      },
    },
  });

  if (!session || new Date(session.expires) < new Date()) {
    return null;
  }

  return session;
}
