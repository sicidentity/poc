const express = require("express");
const QrController = require("../controllers/QrController");

const router = express.Router();

// QR Code routes
router.get("/generate/:userId", QrController.generateQR.bind(QrController));
router.post("/validate", QrController.validateQR.bind(QrController));

module.exports = router;
