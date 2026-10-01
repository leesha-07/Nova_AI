const express = require("express");

const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  summarizeNote,
} = require("../controllers/notesController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createNote);

router.get("/:userId", protect, getNotes);

router.put("/:noteId", protect, updateNote);

router.delete("/:noteId", protect, deleteNote);

router.post("/:noteId/summarize", protect, summarizeNote);

module.exports = router;
