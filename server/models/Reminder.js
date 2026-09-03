const mongoose = require("mongoose");
const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    todoId: { type: mongoose.Schema.Types.ObjectId },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    reminderTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "completed"],
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("reminder", reminderSchema);
