const { GoogleGenAI } = require("@google/genai");

const Note = require("../models/Note.js");

const createNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content } = req.body;

    const note = await Note.create({
      userId,
      title,
      content,
    });

    res.status(201).json({
      message: "Notes created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notes = await Note.find({ userId });

    res.status(200).json({
      message: "Found notes",
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      message: "Failed to get notes",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.userId;
    const { title, content } = req.body;

    const note = await Note.findOne({
      _id: noteId,
      userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note was not found",
      });
    }

    if (title !== undefined) {
      note.title = title;
    }

    if (content !== undefined) {
      note.content = content;
    }

    await note.save();

    res.status(200).json({
      message: "Note was updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.userId;

    const note = await Note.findOne({
      _id: noteId,
      userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note was not found",
      });
    }

    await note.deleteOne();

    res.status(200).json({
      message: "Note was deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};

const summarizeNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { prompt } = req.body;
    const userId = req.user.userId;

    const note = await Note.findOne({
      _id: noteId,
      userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note was not found",
      });
    }

    if (!note.content || !note.content.trim()) {
      return res.status(400).json({
        message: "Note content is empty.",
      });
    }

    const genai = new GoogleGenAI({
      apiKey: process.env.GEMINI_NOTES_API_KEY,
    });

    const response = await genai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `${prompt || "Summarize this note in 3-4 short bullet points."}

Note:

${note.content}`,
    });

    const summaryText = response.text;

    note.summary = summaryText;

    await note.save();

    return res.status(200).json({
      message: "Summary generated",
      noteId,
      summary: summaryText,
    });
  } catch (error) {
    console.error("Summarize note error:", error);

    res.status(500).json({
      message: "Failed to summarize note",
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  summarizeNote,
};
