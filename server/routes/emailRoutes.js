const express = require("express");

const router = express.Router();

const {
  createEmail,
  getEmails,
  getEmail,
  updateEmail,
  deleteEmail,
  generateEmail,
} = require("../controllers/emailController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createEmail);

router.get("/user/:userId", protect, getEmails);

router.post("/generate", generateEmail);

router.get("/:emailId", protect, getEmail);

router.put("/:emailId", protect, updateEmail);

router.delete("/:emailId", protect, deleteEmail);

module.exports = router;
