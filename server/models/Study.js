const mongoose = require("mongoose");

const studySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    dailyHours: {
      type: Number,
      required: true,
    },

    goal: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    completedHours: {
      type: Number,
      default: 0,
    },

    progress: {
      type: Number,
      default: 0,
    },

    // Saved AI-generated study plan
    aiPlan: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("study", studySchema);
