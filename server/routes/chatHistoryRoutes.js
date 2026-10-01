const express = require("express");

const {
  createChat,
  getChats,
  updateChat,
} = require("../controllers/chatHistoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createChat);

router.get("/:userId", protect, getChats);

router.put("/:chatId", protect, updateChat);

module.exports = router;
