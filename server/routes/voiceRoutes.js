const express = require("express");

const router = express.Router();

const {
  askVoiceAI,
  createVoice,
  getVoices,
  getVoice,
  deleteVoice,
} = require("../controllers/voiceController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createVoice);

router.post("/ask", protect, askVoiceAI);

router.get("/user/:userId", protect, getVoices);

router.get("/:voiceId", protect, getVoice);

router.delete("/:voiceId", protect, deleteVoice);

module.exports = router;
