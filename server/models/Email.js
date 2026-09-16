const mongoose = require("mongoose");
const emailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    generatedEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("email", emailSchema);
