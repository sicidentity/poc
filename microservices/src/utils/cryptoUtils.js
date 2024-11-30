const crypto = require("crypto");
const { AES_KEY } = require("../config/env");

exports.encryptPayload = (payload) => {
  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(AES_KEY, "utf-8"), iv);
  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

exports.decryptPayload = (encryptedPayload) => {
  const [ivHex, encryptedData] = encryptedPayload.split(":");
  const iv = Buffer.from(ivHex, "hex");
  
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(AES_KEY, "hex"), iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
};