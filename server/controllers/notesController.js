const { GoogleGenAI } = require("@google/genai");
const Note = require("../models/Note.js");
const createNote = async (req, res) => {
  const { userId, title, content } = req.body;
  const note = await Note.create({ userId, title, content });
  res.status(201).json({ message: "Notes created successfully", note });
};
const getNotes = async (req, res) => {
  const { userId } = req.params;
  const notes = await Note.find({ userId });
  res.status(200).json({ message: "Found notes", notes });
};
const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
  const note = await Note.findById(noteId);
  if (!note) {
    return res.status(404).json({ message: "Note was not found" });
  }
  note.title = title;
  note.content = content;
  await note.save();
  res.status(200).json({ message: "Note was updated successfully", note });
};
const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    return res.status(404).json({ message: "Note was not found" });
  }
  await note.deleteOne();
  res.status(200).json({ message: "Note was deleted successfully" });
};
const summarizeNote = async (req, res) => {
  const { noteId } = req.params;
  const { prompt } = req.body;
  const note = await Note.findById(noteId);
  if (!note) {
    return res.status(404).json({ message: "Note was not found" });
  }
  if (!note.content || !note.content.trim()) {
    return res.status(400).json({ message: "Note content is empty." });
  }
  const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_NOTES_API_KEY });
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt || "Summarize this note in 3-4 short bullet points."}

Note:
${note.content}`,
  });
  const summaryText = response.text;
  note.summary = summaryText;
  await note.save();
  return res
    .status(200)
    .json({ message: "Summary generated", noteId, summary: summaryText });
};
module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  summarizeNote,
};
