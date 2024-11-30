const { PrismaClient } = require("@prisma/client");

// Create a single Prisma Client instance
const prisma = new PrismaClient();

// Export the instance for use in the project
module.exports = prisma;
