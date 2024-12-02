const express = require("express");
const QrController = require("../controllers/QrController");

const router = express.Router();

// User management routes
router.post("/", QrController.createUser.bind(QrController));
router.get("/", QrController.getAllUsers.bind(QrController));
router.get("/:id", QrController.getUserById.bind(QrController));
router.put("/:id", QrController.updateUser.bind(QrController));
router.delete("/:id", QrController.deleteUser.bind(QrController));

module.exports = router;
