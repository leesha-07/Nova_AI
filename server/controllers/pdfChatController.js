const Pdf = require("../models/pdfChat.js");
const { GoogleGenAI } = require("@google/genai");

const genai = new GoogleGenAI({
  apiKey: process.env.PDF_GEMINI_API_KEY,
});
const createPdf = async (req, res) => {
  const { userId, fileName, fileUrl, extractedText } = req.body;
  const pdf = await Pdf.create({
    userId,
    fileName,
    fileUrl,
    extractedText,
  });
  res.status(201).json({ message: "PDFs created successfully", pdf });
};

const getPdf = async (req, res) => {
  const { userId } = req.params;
  const pdfs = await Pdf.find({ userId });
  res.status(200).json({ message: "Found PDFs", pdfs });
};

const updatePdf = async (req, res) => {
  const { pdfId } = req.params;
  const { userId, fileName, fileUrl, extractedText } = req.body;
  const pdf = await Pdf.findById(pdfId);
  if (!pdf) {
    return res.status(404).json({ message: "PDF was not found" });
  }
  pdf.userId = userId;
  pdf.fileName = fileName;
  pdf.fileUrl = fileUrl;
  pdf.extractedText = extractedText;

  await pdf.save();
  res.status(200).json({ message: "PDF was updated successfully", pdf });
};

const deletePdf = async (req, res) => {
  const { pdfId } = req.params;
  const pdf = await Pdf.findById(pdfId);
  if (!pdf) {
    return res.status(404).json({ message: "PDF was not found" });
  }
  await pdf.deleteOne();
  res.status(200).json({ message: "PDF was deleted successfully" });
};
const summarizePdf = async (req, res) => {
  try {
    const { pdfId } = req.params;

    const pdf = await Pdf.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({
        message: "PDF was not found",
      });
    }

    if (!pdf.extractedText || pdf.extractedText.trim() === "") {
      return res.status(400).json({
        message: "No extracted text available for this PDF",
      });
    }

    const response = await genai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: `Summarize the following PDF content clearly and concisely.

Focus on:
- Main purpose
- Important points
- Key findings
- Important sections
- Conclusion

PDF content:

${pdf.extractedText}`,
    });

    pdf.summary = response.output_text;

    await pdf.save();

    res.status(200).json({
      message: "PDF summarized successfully",
      summary: pdf.summary,
      pdf,
    });
  } catch (error) {
    console.error("PDF summary error:", error);

    res.status(500).json({
      message: "PDF summary failed",
      error: error.message,
    });
  }
};
const askPdfQuestion = async (req, res) => {
  try {
    const { pdfId } = req.params;
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const pdf = await Pdf.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({
        message: "PDF was not found",
      });
    }

    if (!pdf.extractedText || pdf.extractedText.trim() === "") {
      return res.status(400).json({
        message: "No extracted text available for this PDF",
      });
    }

    const response = await genai.interactions.create({
      model: "gemini-3.1-flash-lite",
      input: `Answer the user's question using ONLY the information provided in the PDF.

Do not invent information.
If the answer cannot be found in the PDF, say:
"The answer is not available in the uploaded PDF."

Keep the answer clear and concise.
Do not use Markdown formatting such as **, *, #, or backticks.

PDF content:

${pdf.extractedText}

User question:

${question}`,
    });

    const answer = response.output_text;

    res.status(200).json({
      message: "Question answered successfully",
      answer,
    });
  } catch (error) {
    console.error("PDF question error:", error);

    res.status(500).json({
      message: "Failed to answer PDF question",
      error: error.message,
    });
  }
};
module.exports = {
  createPdf,
  getPdf,
  updatePdf,
  deletePdf,
  summarizePdf,
  askPdfQuestion,
};
