const prisma = require("../config/prisma");
const { encryptPayload, decryptPayload } = require("../utils/cryptoUtils");
const QRCode = require("qrcode");

class QrController {
  // --- QR Code Methods ---

  // Method to generate QR code
  async generateQR(req, res) {
    const { userId } = req.params;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const payload = { userId, timestamp };
      const encryptedPayload = encryptPayload(payload);

      await prisma.user.update({
        where: { id: userId },
        data: { qrSignature: encryptedPayload, qrTimestamp: new Date(timestamp * 1000) },
      });

      const qrImage = await QRCode.toDataURL(encryptedPayload);

      return res.json({ qrImage });
    } catch (err) {
      console.error("Error generating QR code:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method to validate QR code
  async validateQR(req, res) {
    const { encryptedPayload } = req.body;

    try {
      const { userId, timestamp } = decryptPayload(encryptedPayload);

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (Math.abs(currentTime - timestamp) > 300) {
        return res.status(400).json({ error: "QR code expired" });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,  // Returning full name of the user
          email: user.email,        // Returning email address
          dateOfBirth: user.dateOfBirth,  // Returning date of birth
          studentNumber: user.studentNumber,  // Returning student number
          // qrSignature: user.qrSignature,  // Returning QR signature
          // qrTimestamp: user.qrTimestamp,  // Returning QR timestamp
          program: user.program,    // Returning program/course of study
          yearOfStudy: user.yearOfStudy,  // Returning current year of study
          nin: user.nin,            // Returning NIN (National Identification Number)
          createdAt: user.createdAt,  // Created timestamp
          updatedAt: user.updatedAt,  // Updated timestamp
        },
      });
    } catch (err) {
      console.error("Error validating QR code:", err);
      return res.status(400).json({ error: "Invalid QR code or decryption failed" });
    }
  }

  // --- User Management Methods ---

  // Create a new user
  async createUser(req, res) {
    try {
      const { email, name } = req.body;
      const user = await prisma.user.create({
        data: { email, name },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, name } = req.body;
      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: { email, name },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id: parseInt(id) } });
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new QrController();
