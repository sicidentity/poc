const express = require("express");
const userRoutes = require("./userRoutes");
const qrRoutes = require("./qrRoutes");

const router = express.Router();

// Mount all feature routes
router.use("/users", userRoutes);
router.use("/qr", qrRoutes);

module.exports = router;
