const Todo = require("../models/Todo");
const Reminder = require("../models/Reminder");
const Note = require("../models/Note");
const Study = require("../models/Study");
const Resume = require("../models/Resume");

const getDashboard = async (req, res) => {
  const { userId } = req.params;

  const todos = await Todo.find({ userId });
  const reminders = await Reminder.find({ userId });
  const notes = await Note.find({ userId });
  const studies = await Study.find({ userId });
  const resumes = await Resume.find({ userId });

  const totalTodos = todos.length;

  const completedTodos = todos.filter((todo) => todo.completed === true).length;

  const pendingTodos = todos.filter((todo) => todo.completed === false).length;

  const totalReminders = reminders.length;

  const pendingReminders = reminders.filter(
    (reminder) => reminder.status === "pending",
  ).length;

  const totalNotes = notes.length;

  const totalStudyPlans = studies.length;

  const totalResumes = resumes.length;

  res.status(200).json({
    message: "Dashboard data found",

    dashboard: {
      todos: {
        total: totalTodos,
        completed: completedTodos,
        pending: pendingTodos,
      },

      reminders: {
        total: totalReminders,
        pending: pendingReminders,
      },

      notes: totalNotes,

      studyPlans: totalStudyPlans,

      resumes: totalResumes,
    },
  });
};

module.exports = { getDashboard };
