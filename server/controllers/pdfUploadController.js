const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const Pdf = require("../models/pdfChat");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const uploadPdf = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    const pdf = await Pdf.create({
      userId,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      extractedText: pdfData.text,
    });

    res.status(201).json({
      message: "PDF uploaded and text extracted successfully",
      pdf,
    });
  } catch (error) {
    console.error("PDF upload error:", error);

    res.status(500).json({
      message: "PDF upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadPdf,
};
