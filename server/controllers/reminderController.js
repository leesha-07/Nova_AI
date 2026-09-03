const Reminder = require("../models/Reminder.js");
const createReminder = async (req, res) => {
  const { userId, title, message, reminderDate, reminderTime, status } =
    req.body;
  const newReminder = await Reminder.create({
    userId,
    title,
    message,
    reminderDate,
    reminderTime,
    status,
  });
  res
    .status(201)
    .json({ message: "Reminder created successfully", newReminder });
};
const getReminders = async (req, res) => {
  const { userId } = req.params;
  const reminders = await Reminder.find({ userId });
  res.status(200).json({ message: "The Reminders found", reminders });
};
const getReminder = async (req, res) => {
  const { reminderId } = req.params;
  const reminder = await Reminder.findById(reminderId);
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  res.status(200).json({ message: "Found Reminder", reminder });
};
const updateReminder = async (req, res) => {
  const { reminderId } = req.params;
  const { message, title, reminderDate, reminderTime, status } = req.body;
  const reminder = await Reminder.findById(reminderId);
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  reminder.title = title;
  reminder.message = message;
  reminder.reminderDate = reminderDate;
  reminder.reminderTime = reminderTime;
  reminder.status = status;
  await reminder.save();
  res.status(200).json({ message: "Reminder updated successfully", reminder });
};

const deleteReminder = async (req, res) => {
  const { reminderId } = req.params;
  const reminder = await Reminder.findById(reminderId);
  if (!reminder) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  await reminder.deleteOne();
  res.status(200).json({ message: "Reminder was deleted successfully" });
};
module.exports = {
  getReminder,
  getReminders,
  updateReminder,
  createReminder,
  deleteReminder,
};
