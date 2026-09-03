const express = require("express");
const {
  createReminder,
  getReminders,
  getReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminderController");
const router = express.Router();
router.post("/", createReminder);
router.get("/user/:userId", getReminders);
router.get("/:reminderId", getReminder);
router.put("/:reminderId", updateReminder);
router.delete("/:reminderId", deleteReminder);
module.exports = router;
