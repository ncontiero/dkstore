import { totp } from "speakeasy";
import { decrypt } from "./cryptography";

export function isTotpValid(
  encryptedSecret: ArrayBufferLike,
  encryptedSecretIV: ArrayBufferLike,
  code: string,
) {
  const decryptedSecret = decrypt(
    Buffer.from(encryptedSecret),
    Buffer.from(encryptedSecretIV),
  );
  if (!decryptedSecret) {
    throw new Error("Error decrypting secret. Please try again later");
  }

  return totp.verify({
    secret: decryptedSecret,
    encoding: "base32",
    token: code,
    window: 1,
    step: 30,
  });
}
