const express = require("express");

const {
  createReminder,
  getReminders,
  getReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReminder);

router.get("/user/:userId", protect, getReminders);

router.get("/:reminderId", protect, getReminder);

router.put("/:reminderId", protect, updateReminder);

router.delete("/:reminderId", protect, deleteReminder);

module.exports = router;
