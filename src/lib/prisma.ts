import { PrismaClient } from "@prisma/client";
import { env } from "@/env";

const createPrismaClient = () =>
  new PrismaClient({
    log: ["error"],
    omit: { user: { passwordHash: true } },
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
