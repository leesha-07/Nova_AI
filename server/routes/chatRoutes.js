const express = require("express");

const { chatUser } = require("../controllers/chatController.js");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, chatUser);

module.exports = router;
