import type { User as PrismaUser, RecoveryCode, Session } from "@dkstore/db";

export interface User extends Omit<PrismaUser, "passwordHash"> {}
export interface UserWithRecoveryCodes extends User {
  recoveryCodes: RecoveryCode[];
}

export interface SessionWhitUser<T = User> extends Session {
  user: T;
}
