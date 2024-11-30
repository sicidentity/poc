const express = require("express");
const QrController = require("../controllers/QrController");

const router = express.Router();

// QR code routes
router.get("/generate-qr/:userId", QrController.generateQR.bind(QrController));
router.post("/validate-qr", QrController.validateQR.bind(QrController));

module.exports = router;
