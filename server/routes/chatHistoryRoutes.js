const express = require("express");
const {
  createChat,
  getChats,
  updateChat,
} = require("../controllers/chatHistoryController");
const router = express.Router();
router.post("/", createChat);
router.get("/:userId", getChats);
router.put("/:chatId", updateChat);
module.exports = router;
