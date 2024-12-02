const crypto = require("crypto");
const { AES_KEY } = require("../config/env");

// Ensure AES key is exactly 32 bytes
const getKey = () => {
  const key = Buffer.from(AES_KEY, 'utf-8');
  if (key.length < 32) {
    return Buffer.concat([key, Buffer.alloc(32 - key.length)]);
  }
  return key.slice(0, 32);
};

exports.encryptPayload = (payload) => {
  try {
    const iv = crypto.randomBytes(16);
    const key = getKey();
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    
    let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
    encrypted += cipher.final("hex");
    
    // Combine IV and encrypted data with a delimiter
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt payload");
  }
};

exports.decryptPayload = (encryptedPayload) => {
  try {
    const [ivHex, encryptedData] = encryptedPayload.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = getKey();
    
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt payload");
  }
};