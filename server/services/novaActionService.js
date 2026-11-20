const Todo = require("../models/todo");
const Reminder = require("../models/Reminder");
const Study = require("../models/Study");
const Note = require("../models/Note");
const Email = require("../models/Email");
const Pdf = require("../models/pdfChat");
const Resume = require("../models/Resume");

const { GoogleGenAI } = require("@google/genai");

const pdfGenai = new GoogleGenAI({
  apiKey: process.env.PDF_GEMINI_API_KEY,
});

const resumeGenai = new GoogleGenAI({
  apiKey: process.env.Resume_GEMINI_API_KEY,
});

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function executeNovaActions(actions, userId, originalMessage) {
  const actionResults = [];

  for (const action of actions) {
    try {
      /*
      ==============================================
      CREATE TODO
      ==============================================
      */

      if (action.type === "CREATE_TODO") {
        const data = action.data || {};

        const title = data.title || "New Task";
        const content = data.content || title;

        const priority = ["Low", "Medium", "High"].includes(data.priority)
          ? data.priority
          : "Medium";

        let dueDate;

        if (data.dueDate) {
          dueDate = new Date(data.dueDate);
        }

        const todo = await Todo.create({
          userId,
          title,
          content,
          priority,
          dueDate,
        });

        actionResults.push({
          action: "CREATE_TODO",
          success: true,
          message: `Todo created: ${todo.title}`,
          data: todo,
        });
      } else if (action.type === "UPDATE_TODO") {
        /*
      ==============================================
      UPDATE TODO
      ==============================================
      */
        const data = action.data || {};

        let todo;

        if (data.todoId) {
          todo = await Todo.findOne({
            _id: data.todoId,
            userId,
          });
        }

        if (!todo && data.title) {
          todo = await Todo.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!todo) {
          actionResults.push({
            action: "UPDATE_TODO",
            success: false,
            message: "Todo to update was not found.",
          });

          continue;
        }

        if (data.title && data.title !== "null") {
          todo.title = data.title;
        }

        if (data.content && data.content !== "null") {
          todo.content = data.content;
        }

        if (
          data.priority &&
          ["Low", "Medium", "High"].includes(data.priority)
        ) {
          todo.priority = data.priority;
        }

        if (data.dueDate && data.dueDate !== "null") {
          todo.dueDate = new Date(data.dueDate);
        }

        await todo.save();

        actionResults.push({
          action: "UPDATE_TODO",
          success: true,
          message: `Todo updated: ${todo.title}`,
          data: todo,
        });
      } else if (action.type === "COMPLETE_TODO") {
        /*
      ==============================================
      COMPLETE TODO
      ==============================================
      */
        const data = action.data || {};

        let todo;

        if (data.todoId) {
          todo = await Todo.findOne({
            _id: data.todoId,
            userId,
          });
        }

        if (!todo && data.title) {
          todo = await Todo.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!todo) {
          actionResults.push({
            action: "COMPLETE_TODO",
            success: false,
            message: "Todo to complete was not found.",
          });

          continue;
        }

        todo.completed = true;

        await todo.save();

        actionResults.push({
          action: "COMPLETE_TODO",
          success: true,
          message: `Todo completed: ${todo.title}`,
          data: todo,
        });
      } else if (action.type === "DELETE_TODO") {
        /*
      ==============================================
      DELETE TODO
      ==============================================
      */
        const data = action.data || {};

        let todo;

        if (data.todoId) {
          todo = await Todo.findOne({
            _id: data.todoId,
            userId,
          });
        }

        if (!todo && data.title) {
          todo = await Todo.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!todo) {
          actionResults.push({
            action: "DELETE_TODO",
            success: false,
            message: "Todo to delete was not found.",
          });

          continue;
        }

        const deletedTitle = todo.title;

        await todo.deleteOne();

        actionResults.push({
          action: "DELETE_TODO",
          success: true,
          message: `Todo deleted: ${deletedTitle}`,
        });
      } else if (action.type === "CREATE_REMINDER") {
        /*
      ==============================================
      CREATE REMINDER
      ==============================================
      */
        const data = action.data || {};

        if (!data.reminderDate || !data.reminderTime) {
          actionResults.push({
            action: "CREATE_REMINDER",
            success: false,
            message: "Reminder requires a date and time.",
          });

          continue;
        }

        let todoId;

        if (data.todoId && data.todoId !== "null") {
          const todo = await Todo.findOne({
            _id: data.todoId,
            userId,
          });

          if (todo) {
            todoId = todo._id;
          }
        }

        const reminder = await Reminder.create({
          userId,
          todoId,
          title: data.title || "Reminder",
          message: data.message || data.title || "Reminder",
          reminderDate: new Date(data.reminderDate),
          reminderTime: data.reminderTime,
          status: "pending",
        });

        actionResults.push({
          action: "CREATE_REMINDER",
          success: true,
          message: `Reminder created: ${reminder.title}`,
          data: reminder,
        });
      } else if (action.type === "UPDATE_REMINDER") {
        /*
      ==============================================
      UPDATE REMINDER
      ==============================================
      */
        const data = action.data || {};

        let reminder;

        if (data.reminderId) {
          reminder = await Reminder.findOne({
            _id: data.reminderId,
            userId,
          });
        }

        if (!reminder && data.title) {
          reminder = await Reminder.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!reminder) {
          actionResults.push({
            action: "UPDATE_REMINDER",
            success: false,
            message: "Reminder to update was not found.",
          });

          continue;
        }

        if (data.title && data.title !== "null") {
          reminder.title = data.title;
        }

        if (data.message && data.message !== "null") {
          reminder.message = data.message;
        }

        if (data.reminderDate && data.reminderDate !== "null") {
          reminder.reminderDate = new Date(data.reminderDate);
        }

        if (data.reminderTime && data.reminderTime !== "null") {
          reminder.reminderTime = data.reminderTime;
        }

        if (
          data.status &&
          ["pending", "sent", "completed"].includes(data.status)
        ) {
          reminder.status = data.status;
        }

        await reminder.save();

        actionResults.push({
          action: "UPDATE_REMINDER",
          success: true,
          message: `Reminder updated: ${reminder.title}`,
          data: reminder,
        });
      } else if (action.type === "DELETE_REMINDER") {
        /*
      ==============================================
      DELETE REMINDER
      ==============================================
      */
        const data = action.data || {};

        let reminder;

        if (data.reminderId) {
          reminder = await Reminder.findOne({
            _id: data.reminderId,
            userId,
          });
        }

        if (!reminder && data.title) {
          reminder = await Reminder.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!reminder) {
          actionResults.push({
            action: "DELETE_REMINDER",
            success: false,
            message: "Reminder to delete was not found.",
          });

          continue;
        }

        const deletedTitle = reminder.title;

        await reminder.deleteOne();

        actionResults.push({
          action: "DELETE_REMINDER",
          success: true,
          message: `Reminder deleted: ${deletedTitle}`,
        });
      } else if (action.type === "CREATE_STUDY_PLAN") {
        /*
      ==============================================
      CREATE STUDY PLAN
      ==============================================
      */
        const data = action.data || {};

        const study = await Study.create({
          userId,
          title: data.title || `${data.subject || "Study"} Plan`,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          subject: data.subject || "General",
          endDate: data.endDate ? new Date(data.endDate) : new Date(),
          dailyHours: Number(data.dailyHours) || 1,
          goal: data.goal || "Complete the study plan",
          status: data.status || "planned",
        });

        actionResults.push({
          action: "CREATE_STUDY_PLAN",
          success: true,
          message: `Study plan created: ${study.title}`,
          data: study,
        });
      } else if (action.type === "UPDATE_STUDY_PLAN") {
        /*
      ==============================================
      UPDATE STUDY PLAN
      ==============================================
      */
        const data = action.data || {};

        let study;

        if (data.studyId) {
          study = await Study.findOne({
            _id: data.studyId,
            userId,
          });
        }

        if (!study && data.title) {
          study = await Study.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!study) {
          actionResults.push({
            action: "UPDATE_STUDY_PLAN",
            success: false,
            message: "Study plan to update was not found.",
          });

          continue;
        }

        if (data.title && data.title !== "null") {
          study.title = data.title;
        }

        if (data.subject && data.subject !== "null") {
          study.subject = data.subject;
        }

        if (data.startDate && data.startDate !== "null") {
          study.startDate = new Date(data.startDate);
        }

        if (data.endDate && data.endDate !== "null") {
          study.endDate = new Date(data.endDate);
        }

        if (data.dailyHours !== undefined && data.dailyHours !== null) {
          study.dailyHours = Number(data.dailyHours);
        }

        if (data.goal && data.goal !== "null") {
          study.goal = data.goal;
        }

        if (data.status && data.status !== "null") {
          study.status = data.status;
        }

        if (data.completedHours !== undefined && data.completedHours !== null) {
          study.completedHours = Number(data.completedHours);
        }

        if (data.progress !== undefined && data.progress !== null) {
          study.progress = Number(data.progress);
        }

        await study.save();

        actionResults.push({
          action: "UPDATE_STUDY_PLAN",
          success: true,
          message: `Study plan updated: ${study.title}`,
          data: study,
        });
      } else if (action.type === "DELETE_STUDY_PLAN") {
        /*
      ==============================================
      DELETE STUDY PLAN
      ==============================================
      */
        const data = action.data || {};

        let study;

        if (data.studyId) {
          study = await Study.findOne({
            _id: data.studyId,
            userId,
          });
        }

        if (!study && data.title) {
          study = await Study.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!study) {
          actionResults.push({
            action: "DELETE_STUDY_PLAN",
            success: false,
            message: "Study plan to delete was not found.",
          });

          continue;
        }

        const deletedTitle = study.title;

        await study.deleteOne();

        actionResults.push({
          action: "DELETE_STUDY_PLAN",
          success: true,
          message: `Study plan deleted: ${deletedTitle}`,
        });
      } else if (action.type === "CREATE_NOTE") {
        /*
      ==============================================
      CREATE NOTE
      ==============================================
      */
        const data = action.data || {};

        const note = await Note.create({
          userId,
          title: data.title || "Nova AI Note",
          content: data.content || originalMessage,
        });

        actionResults.push({
          action: "CREATE_NOTE",
          success: true,
          message: `Note created: ${note.title}`,
          data: note,
        });
      } else if (action.type === "UPDATE_NOTE") {
        /*
      ==============================================
      UPDATE NOTE
      ==============================================
      */
        const data = action.data || {};

        let note;

        if (data.noteId) {
          note = await Note.findOne({
            _id: data.noteId,
            userId,
          });
        }

        if (!note && data.title) {
          note = await Note.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!note) {
          actionResults.push({
            action: "UPDATE_NOTE",
            success: false,
            message: "Note to update was not found.",
          });

          continue;
        }

        if (data.title && data.title !== "null") {
          note.title = data.title;
        }

        if (data.content && data.content !== "null") {
          note.content = data.content;
        }

        if (data.summary && data.summary !== "null") {
          note.summary = data.summary;
        }

        await note.save();

        actionResults.push({
          action: "UPDATE_NOTE",
          success: true,
          message: `Note updated: ${note.title}`,
          data: note,
        });
      } else if (action.type === "DELETE_NOTE") {
        /*
      ==============================================
      DELETE NOTE
      ==============================================
      */
        const data = action.data || {};

        let note;

        if (data.noteId) {
          note = await Note.findOne({
            _id: data.noteId,
            userId,
          });
        }

        if (!note && data.title) {
          note = await Note.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        if (!note) {
          actionResults.push({
            action: "DELETE_NOTE",
            success: false,
            message: "Note to delete was not found.",
          });

          continue;
        }

        const deletedTitle = note.title;

        await note.deleteOne();

        actionResults.push({
          action: "DELETE_NOTE",
          success: true,
          message: `Note deleted: ${deletedTitle}`,
        });
      } else if (action.type === "GET_NOTE") {
        /*
      ==============================================
      GET NOTE
      ==============================================
      */
        const data = action.data || {};

        let note;

        /*
        First try Note ID
        */

        if (data.noteId) {
          note = await Note.findOne({
            _id: data.noteId,
            userId,
          });
        }

        /*
        Otherwise try exact Note title
        */

        if (!note && data.title) {
          note = await Note.findOne({
            userId,
            title: new RegExp(`^${escapeRegex(data.title)}$`, "i"),
          });
        }

        /*
        Note not found
        */

        if (!note) {
          actionResults.push({
            action: "GET_NOTE",
            success: false,
            message: "Note was not found.",
          });

          continue;
        }

        /*
        Return the actual note content.
        No AI call is required here.
        */

        actionResults.push({
          action: "GET_NOTE",
          success: true,
          message: `Note found: ${note.title}`,
          data: {
            noteId: note._id,
            title: note.title,
            content: note.content,
            summary: note.summary || "",
          },
        });
      } else if (action.type === "GET_PDFS") {
        /*
      ==============================================
      GET PDFS
      ==============================================
      */
        const pdfs = await Pdf.find({ userId }).sort({
          createdAt: -1,
        });

        actionResults.push({
          action: "GET_PDFS",
          success: true,
          message: `Found ${pdfs.length} PDF(s).`,
          data: pdfs,
        });
      } else if (action.type === "ASK_PDF") {
        /*
      ==============================================
      ASK PDF
      ==============================================
      */
        const data = action.data || {};

        if (!data.question) {
          actionResults.push({
            action: "ASK_PDF",
            success: false,
            message: "A question is required for the PDF.",
          });

          continue;
        }

        let pdf;

        if (data.pdfId) {
          pdf = await Pdf.findOne({
            _id: data.pdfId,
            userId,
          });
        }

        if (!pdf && data.fileName) {
          pdf = await Pdf.findOne({
            userId,
            fileName: new RegExp(`^${escapeRegex(data.fileName)}$`, "i"),
          });
        }

        if (!pdf) {
          pdf = await Pdf.findOne({ userId }).sort({
            createdAt: -1,
          });
        }

        if (!pdf) {
          actionResults.push({
            action: "ASK_PDF",
            success: false,
            message: "No PDF was found.",
          });

          continue;
        }

        if (!pdf.extractedText || !pdf.extractedText.trim()) {
          actionResults.push({
            action: "ASK_PDF",
            success: false,
            message: "The selected PDF has no extracted text.",
          });

          continue;
        }

        const response = await pdfGenai.interactions.create({
          model: "gemini-3.1-flash-lite",

          input: `Answer the user's question using ONLY the information provided in the PDF.

Do not invent information.

If the answer cannot be found in the PDF, say:

"The answer is not available in the uploaded PDF."

Keep the answer clear and concise.

Do not use Markdown formatting.

PDF:

${pdf.extractedText}

User question:

${data.question}`,
        });

        const answer = response.output_text;

        actionResults.push({
          action: "ASK_PDF",
          success: true,
          message: `Answered question from PDF: ${pdf.fileName}`,
          data: {
            pdfId: pdf._id,
            fileName: pdf.fileName,
            question: data.question,
            answer,
          },
        });
      } else if (action.type === "SUMMARIZE_PDF") {
        /*
      ==============================================
      SUMMARIZE PDF
      ==============================================
      */
        const data = action.data || {};

        let pdf;

        if (data.pdfId) {
          pdf = await Pdf.findOne({
            _id: data.pdfId,
            userId,
          });
        }

        if (!pdf && data.fileName) {
          pdf = await Pdf.findOne({
            userId,
            fileName: new RegExp(`^${escapeRegex(data.fileName)}$`, "i"),
          });
        }

        if (!pdf) {
          pdf = await Pdf.findOne({ userId }).sort({
            createdAt: -1,
          });
        }

        if (!pdf) {
          actionResults.push({
            action: "SUMMARIZE_PDF",
            success: false,
            message: "No PDF was found.",
          });

          continue;
        }

        if (!pdf.extractedText || !pdf.extractedText.trim()) {
          actionResults.push({
            action: "SUMMARIZE_PDF",
            success: false,
            message: "The selected PDF has no extracted text.",
          });

          continue;
        }

        const response = await pdfGenai.interactions.create({
          model: "gemini-3.1-flash-lite",

          input: `Summarize the following PDF content clearly and concisely.

Focus on:

- Main purpose
- Important points
- Key findings
- Important sections
- Conclusion

PDF content:

${pdf.extractedText}`,
        });

        pdf.summary = response.output_text;

        await pdf.save();

        actionResults.push({
          action: "SUMMARIZE_PDF",
          success: true,
          message: `PDF summarized: ${pdf.fileName}`,
          data: {
            pdfId: pdf._id,
            fileName: pdf.fileName,
            summary: pdf.summary,
          },
        });
      } else if (action.type === "GET_RESUMES") {
        /*
      ==============================================
      GET RESUMES
      ==============================================
      */
        const resumes = await Resume.find({ userId }).sort({
          createdAt: -1,
        });

        actionResults.push({
          action: "GET_RESUMES",
          success: true,
          message: `Found ${resumes.length} saved resume(s).`,
          data: resumes,
        });
      } else if (action.type === "ANALYZE_RESUME") {
        /*
      ==============================================
      ANALYZE RESUME
      ==============================================
      */
        const data = action.data || {};

        let resume;

        if (data.resumeId) {
          resume = await Resume.findOne({
            _id: data.resumeId,
            userId,
          });
        }

        if (!resume && data.fileName) {
          resume = await Resume.findOne({
            userId,
            fileName: new RegExp(`^${escapeRegex(data.fileName)}$`, "i"),
          });
        }

        if (!resume) {
          resume = await Resume.findOne({ userId }).sort({
            createdAt: -1,
          });
        }

        if (!resume) {
          actionResults.push({
            action: "ANALYZE_RESUME",
            success: false,
            message: "No resume was found.",
          });

          continue;
        }

        if (!resume.resumeText || !resume.resumeText.trim()) {
          actionResults.push({
            action: "ANALYZE_RESUME",
            success: false,
            message: "The selected resume has no extracted text.",
          });

          continue;
        }

        const response = await resumeGenai.interactions.create({
          model: "gemini-3.1-flash-lite",

          input: `Analyze the following resume.

Resume:

${resume.resumeText}

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "atsScore": 0,
  "grammar": 0,
  "keywords": [],
  "skills": [],
  "suggestions": []
}

Rules:

overallScore:

Give an overall resume score from 0 to 100.

atsScore:

Give an ATS compatibility score from 0 to 100.

grammar:

Give a grammar and writing quality score from 0 to 100.

keywords:

Return important job-related keywords found in the resume.

Return as an array of strings.

skills:

Return technical and professional skills found in the resume.

Return as an array of strings.

suggestions:

Return 4 to 6 useful suggestions for improving the resume.

Return as an array of strings.

Do not include Markdown.

Do not include explanations outside the JSON.`,
        });

        let result = response.output_text;

        result = result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        let analysis;

        try {
          analysis = JSON.parse(result);
        } catch (error) {
          console.error("Resume AI returned invalid JSON:", result);

          actionResults.push({
            action: "ANALYZE_RESUME",
            success: false,
            message: "Resume AI returned an invalid analysis format.",
          });

          continue;
        }

        resume.overallScore = Number(analysis.overallScore) || 0;
        resume.atsScore = Number(analysis.atsScore) || 0;
        resume.grammar = Number(analysis.grammar) || 0;

        resume.keywords = Array.isArray(analysis.keywords)
          ? analysis.keywords
          : [];

        resume.skills = Array.isArray(analysis.skills) ? analysis.skills : [];

        resume.suggestions = Array.isArray(analysis.suggestions)
          ? analysis.suggestions
          : [];

        await resume.save();

        actionResults.push({
          action: "ANALYZE_RESUME",
          success: true,
          message: `Resume analyzed: ${resume.fileName}`,
          data: {
            resumeId: resume._id,
            fileName: resume.fileName,
            overallScore: resume.overallScore,
            atsScore: resume.atsScore,
            grammar: resume.grammar,
            keywords: resume.keywords,
            skills: resume.skills,
            suggestions: resume.suggestions,
          },
        });
      } else if (action.type === "GET_EMAILS") {
        /*
      ==============================================
      GET EMAILS
      ==============================================
      */
        const emails = await Email.find({ userId }).sort({
          createdAt: -1,
        });

        actionResults.push({
          action: "GET_EMAILS",
          success: true,
          message: `Found ${emails.length} saved email(s).`,
          data: emails,
        });
      } else if (action.type === "CREATE_EMAIL") {
        /*
      ==============================================
      CREATE EMAIL
      ==============================================
      */
        const data = action.data || {};

        if (
          !data.subject ||
          !data.purpose ||
          !data.tone ||
          !data.generatedEmail
        ) {
          actionResults.push({
            action: "CREATE_EMAIL",
            success: false,
            message:
              "Email requires subject, purpose, tone, and generated email content.",
          });

          continue;
        }

        const email = await Email.create({
          userId,
          subject: data.subject,
          purpose: data.purpose,
          tone: data.tone,
          content: data.content || "",
          generatedEmail: data.generatedEmail,
        });

        actionResults.push({
          action: "CREATE_EMAIL",
          success: true,
          message: `Email saved: ${email.subject}`,
          data: email,
        });
      } else if (action.type === "UPDATE_EMAIL") {
        /*
      ==============================================
      UPDATE EMAIL
      ==============================================
      */
        const data = action.data || {};

        let email;

        if (data.emailId) {
          email = await Email.findOne({
            _id: data.emailId,
            userId,
          });
        }

        if (!email && data.subject) {
          email = await Email.findOne({
            userId,
            subject: new RegExp(`^${escapeRegex(data.subject)}$`, "i"),
          });
        }

        if (!email) {
          actionResults.push({
            action: "UPDATE_EMAIL",
            success: false,
            message: "Email to update was not found.",
          });

          continue;
        }

        if (data.subject && data.subject !== "null") {
          email.subject = data.subject;
        }

        if (data.purpose && data.purpose !== "null") {
          email.purpose = data.purpose;
        }

        if (data.tone && data.tone !== "null") {
          email.tone = data.tone;
        }

        if (data.content && data.content !== "null") {
          email.content = data.content;
        }

        if (data.generatedEmail && data.generatedEmail !== "null") {
          email.generatedEmail = data.generatedEmail;
        }

        await email.save();

        actionResults.push({
          action: "UPDATE_EMAIL",
          success: true,
          message: `Email updated: ${email.subject}`,
          data: email,
        });
      } else if (action.type === "DELETE_EMAIL") {
        /*
      ==============================================
      DELETE EMAIL
      ==============================================
      */
        const data = action.data || {};

        let email;

        if (data.emailId) {
          email = await Email.findOne({
            _id: data.emailId,
            userId,
          });
        }

        if (!email && data.subject) {
          email = await Email.findOne({
            userId,
            subject: new RegExp(`^${escapeRegex(data.subject)}$`, "i"),
          });
        }

        if (!email) {
          actionResults.push({
            action: "DELETE_EMAIL",
            success: false,
            message: "Email to delete was not found.",
          });

          continue;
        }

        const deletedSubject = email.subject;

        await email.deleteOne();

        actionResults.push({
          action: "DELETE_EMAIL",
          success: true,
          message: `Email deleted: ${deletedSubject}`,
        });
      }
    } catch (actionError) {
      console.error(`Action ${action.type} error:`, actionError);

      actionResults.push({
        action: action.type,
        success: false,
        message: `Failed to execute ${action.type}.`,
      });
    }
  }

  return actionResults;
}

module.exports = {
  executeNovaActions,
};
