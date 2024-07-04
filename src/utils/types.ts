import type { User as PrismaUser } from "@prisma/client";

export interface User extends Omit<PrismaUser, "passwordHash"> {}
