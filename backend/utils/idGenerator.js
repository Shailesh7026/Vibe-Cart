import crypto from "crypto";

export function generatePublicId(prefix = "item") {
  const random = crypto.randomBytes(4).toString("hex");
  return `${prefix}_${random}`;
}



