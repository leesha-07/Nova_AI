const mongoose = require("mongoose");
const pdfSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    extractedText: { type: String, required: true },
    summary: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("pdf", pdfSchema);
