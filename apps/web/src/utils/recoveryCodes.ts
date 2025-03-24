import crypto from "node:crypto";
import { encrypt } from "./cryptography";

export function generateRecoveryCodes() {
  const recoveryCodes = [];

  for (let i = 0; i < 10; i++) {
    const rawCode = crypto.randomBytes(4).toString("hex");
    const encryptedCode = encrypt(rawCode);

    if (!encryptedCode) {
      throw new Error("Error encrypting recovery code. Please try again later");
    }

    const { encrypted, ivAndAuthTag } = encryptedCode;

    recoveryCodes.push({
      rawCode,
      encryptedCode: encrypted,
      encryptedCodeIV: ivAndAuthTag,
    });
  }

  return recoveryCodes;
}
