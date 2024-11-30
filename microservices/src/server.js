const app = require("./app"); // Import the Express app
const { PORT } = require("./config/env"); // Load port from environment variables
const prisma = require("./config/prisma"); // Import the Prisma client for cleanup

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Closing server gracefully...`);
  try {
    await prisma.$disconnect(); // Disconnect Prisma Client
    console.log("Database connection closed.");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0); // Exit process after cleanup
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1); // Exit with an error code
  }
};

// Handle termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Handle Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Handle termination from Docker or Kubernetes
