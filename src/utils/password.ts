import { compare, hash } from "bcryptjs";

export const PASSWORD_SALT = 8;

export async function createPassHash(password: string) {
  return await hash(password, PASSWORD_SALT);
}

export async function verifyPassHash(password: string, hash: string) {
  return await compare(password, hash);
}
