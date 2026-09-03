const express = require("express");
const router = express.Router();
const {
  createVoice,
  getVoices,
  getVoice,
  deleteVoice,
} = require("../controllers/voiceController");
router.post("/", createVoice);
router.get("/user/:userId", getVoices);
router.get("/:voiceId", getVoice);
router.delete("/:voiceId", deleteVoice);
module.exports = router;
