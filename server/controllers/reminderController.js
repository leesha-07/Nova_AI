const Reminder = require("../models/Reminder.js");

const createReminder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { todoId, title, message, reminderDate, reminderTime, status } =
      req.body;

    const newReminder = await Reminder.create({
      userId,
      todoId,
      title,
      message,
      reminderDate,
      reminderTime,
      status,
    });

    res.status(201).json({
      message: "Reminder created successfully",
      newReminder,
    });
  } catch (error) {
    console.error("Create reminder error:", error);

    res.status(500).json({
      message: "Failed to create reminder",
    });
  }
};

const getReminders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const reminders = await Reminder.find({ userId });

    res.status(200).json({
      message: "The Reminders found",
      reminders,
    });
  } catch (error) {
    console.error("Get reminders error:", error);

    res.status(500).json({
      message: "Failed to get reminders",
    });
  }
};

const getReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.userId;

    const reminder = await Reminder.findOne({
      _id: reminderId,
      userId,
    });

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      message: "Found Reminder",
      reminder,
    });
  } catch (error) {
    console.error("Get reminder error:", error);

    res.status(500).json({
      message: "Failed to get reminder",
    });
  }
};

const updateReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.userId;

    const { message, title, reminderDate, reminderTime, status } = req.body;

    const reminder = await Reminder.findOne({
      _id: reminderId,
      userId,
    });

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    if (title !== undefined) {
      reminder.title = title;
    }

    if (message !== undefined) {
      reminder.message = message;
    }

    if (reminderDate !== undefined) {
      reminder.reminderDate = reminderDate;
    }

    if (reminderTime !== undefined) {
      reminder.reminderTime = reminderTime;
    }

    if (status !== undefined) {
      reminder.status = status;
    }

    await reminder.save();

    res.status(200).json({
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (error) {
    console.error("Update reminder error:", error);

    res.status(500).json({
      message: "Failed to update reminder",
    });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const { reminderId } = req.params;
    const userId = req.user.userId;

    const reminder = await Reminder.findOne({
      _id: reminderId,
      userId,
    });

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    await reminder.deleteOne();

    res.status(200).json({
      message: "Reminder was deleted successfully",
    });
  } catch (error) {
    console.error("Delete reminder error:", error);

    res.status(500).json({
      message: "Failed to delete reminder",
    });
  }
};

module.exports = {
  getReminder,
  getReminders,
  updateReminder,
  createReminder,
  deleteReminder,
};
