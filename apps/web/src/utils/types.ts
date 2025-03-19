import type { User as PrismaUser } from "@dkstore/db";

export interface User extends Omit<PrismaUser, "passwordHash"> {}
