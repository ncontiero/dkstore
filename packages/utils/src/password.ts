import { compare, hash } from "bcryptjs";
import { z } from "zod";

export const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await compare(plainTextPassword, hashedPassword);
}

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(64, "Password must be at most 64 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  );

export function validatePassword(password: string) {
  return passwordSchema.safeParse(password);
}
