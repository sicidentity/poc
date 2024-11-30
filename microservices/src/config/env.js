require("dotenv").config(); // Load .env variables

module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || "default_secret",
  AES_KEY: process.env.AES_KEY || "32_character_key_here",
  AES_IV: process.env.AES_IV || "16_character_iv_here",
};
