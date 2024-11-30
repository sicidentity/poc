const express = require("express");
const QrController = require("../controllers/QrController");

const router = express.Router();

// User management routes
router.post("/users", QrController.createUser.bind(QrController));
router.get("/users", QrController.getAllUsers.bind(QrController));
router.get("/users/:id", QrController.getUserById.bind(QrController));
router.put("/users/:id", QrController.updateUser.bind(QrController));
router.delete("/users/:id", QrController.deleteUser.bind(QrController));


module.exports = router;
