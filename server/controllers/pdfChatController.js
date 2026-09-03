const Pdf = require("../models/pdfChat.js");

const createPdf = async (req, res) => {
  const { userId, fileName, fileUrl, extractedText, summary } = req.body;
  const pdf = await Pdf.create({
    userId,
    fileName,
    fileUrl,
    extractedText,
    summary,
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
  const { userId, fileName, fileUrl, extractedText, summary } = req.body;
  const pdf = await Pdf.findById(pdfId);
  if (!pdf) {
    return res.status(404).json({ message: "PDF was not found" });
  }
  pdf.userId = userId;
  pdf.fileName = fileName;
  pdf.fileUrl = fileUrl;
  pdf.extractedText = extractedText;
  pdf.summary = summary;
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

module.exports = {
  createPdf,
  getPdf,
  updatePdf,
  deletePdf,
};
