const express = require("express");
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  summarizeNote,
} = require("../controllers/notesController");
const router = express.Router();
router.post("/", createNote);
router.get("/:userId", getNotes);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);
router.post("/:noteId/summarize", summarizeNote);
module.exports = router;
