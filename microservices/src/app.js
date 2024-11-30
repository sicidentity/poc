const express = require("express");
const cors = require("cors");
const routes = require("./routes"); // Combined routes from `src/routes/index.js`
const rateLimiter = require("./middlewares/rateLimiter"); // Import the rate limiter

const app = express(); // Create the Express app instance

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
app.use(rateLimiter); // Apply the rate limiter to all incoming requests

// Mount Routes
app.use("/api", routes); // Mount all routes under `/api`

module.exports = app; // Export the app instance
