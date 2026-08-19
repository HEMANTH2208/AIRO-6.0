import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = crypto.scryptSync(process.env.AUTH_SECRET || "airo6_fallback_secret_32_bytes_long_key", "salt", 32);

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decrypt(token: string): string | null {
  try {
    const [ivHex, authTagHex, encryptedHex] = textToParts(token);
    if (!ivHex || !authTagHex || !encryptedHex) return null;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return null;
  }
}

function textToParts(token: string): [string, string, string] | [] {
  const parts = token.split(":");
  if (parts.length === 3) {
    return [parts[0], parts[1], parts[2]];
  }
  return [];
}
