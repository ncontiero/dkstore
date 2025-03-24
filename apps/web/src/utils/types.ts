import type { User as PrismaUser, RecoveryCode } from "@dkstore/db";

export interface User extends Omit<PrismaUser, "passwordHash"> {}
export interface UserWithRecoveryCodes extends User {
  recoveryCodes: RecoveryCode[];
}
