const Todo = require("../models/todo");
const Reminder = require("../models/Reminder");
const Note = require("../models/Note");
const Study = require("../models/Study");
const Resume = require("../models/Resume");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const todos = await Todo.find({ userId });
    const reminders = await Reminder.find({ userId });
    const notes = await Note.find({ userId });
    const studies = await Study.find({ userId });
    const resumes = await Resume.find({ userId });

    const totalTodos = todos.length;

    const completedTodos = todos.filter(
      (todo) => todo.completed === true,
    ).length;

    const pendingTodos = todos.filter(
      (todo) => todo.completed === false,
    ).length;

    const totalReminders = reminders.length;

    const pendingReminders = reminders.filter(
      (reminder) => reminder.status === "pending",
    ).length;

    const totalNotes = notes.length;
    const totalStudyPlans = studies.length;
    const totalResumes = resumes.length;

    const productivity =
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    const recentTodos = await Todo.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

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

        productivity,

        recentTodos,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to get dashboard data",
    });
  }
};

module.exports = { getDashboard };
