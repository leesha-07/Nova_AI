const Todo = require("../models/Todo");
const Note = require("../models/Note");
const Pdf = require("../models/pdfChat");
const Email = require("../models/Email");
const Reminder = require("../models/Reminder");
const Study = require("../models/Study");
const Resume = require("../models/Resume");

const smartSearch = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(query, "i");

    const [todos, notes, pdfs, emails, reminders, studies, resumes] =
      await Promise.all([
        Todo.find({
          userId,
          $or: [{ title: searchRegex }, { content: searchRegex }],
        }),

        Note.find({
          userId,
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { summary: searchRegex },
          ],
        }),

        Pdf.find({
          userId,
          $or: [
            { fileName: searchRegex },
            { extractedText: searchRegex },
            { summary: searchRegex },
          ],
        }),

        Email.find({
          userId,
          $or: [
            { subject: searchRegex },
            { purpose: searchRegex },
            { content: searchRegex },
            { generatedEmail: searchRegex },
          ],
        }),

        Reminder.find({
          userId,
          $or: [{ title: searchRegex }, { message: searchRegex }],
        }),

        Study.find({
          userId,
          $or: [
            { title: searchRegex },
            { subject: searchRegex },
            { goal: searchRegex },
          ],
        }),

        Resume.find({
          userId,
          $or: [
            { fileName: searchRegex },
            { skills: searchRegex },
            { keywords: searchRegex },
            { suggestions: searchRegex },
          ],
        }),
      ]);

    res.status(200).json({
      message: "Search results found",
      results: {
        todos,
        notes,
        pdfs,
        emails,
        reminders,
        studies,
        resumes,
      },
    });
  } catch (error) {
    console.error("Smart search error:", error);

    res.status(500).json({
      message: "Search failed",
    });
  }
};

module.exports = { smartSearch };
