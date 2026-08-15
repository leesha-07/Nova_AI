const express = require("express");
const router = express.Router();
const { chatUser } = require("../controllers/chatController.js");
router.post("/", chatUser);
module.exports = router;
