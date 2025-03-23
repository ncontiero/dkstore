import crypto from "node:crypto";
import { env } from "@/env";

export const CIPHER_KEY = crypto
  .createHash("sha256")
  .update(env.CIPHER_KEY)
  .digest();

export function encrypt(secret: string) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", CIPHER_KEY, iv);

    const encrypted = Buffer.concat([
      cipher.update(secret, "utf-8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();
    const ivAndAuthTag = Buffer.concat([iv, authTag]);

    return { ivAndAuthTag, encrypted };
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
}

export function decrypt(encrypted: Buffer, ivAndAuthTag: Buffer) {
  try {
    const iv = ivAndAuthTag.subarray(0, 16);
    const authTag = ivAndAuthTag.subarray(16);

    const decipher = crypto.createDecipheriv("aes-256-gcm", CIPHER_KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf-8");
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
