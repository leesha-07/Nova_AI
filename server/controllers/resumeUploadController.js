const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const Resume = require("../models/Resume");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
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

const uploadResume = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    const buffer = fs.readFileSync(req.file.path);
    const resumeData = await pdfParse(buffer);

    const resume = await Resume.create({
      userId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileUrl: `/uploads/${req.file.filename}`,
      resumeText: resumeData.text,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      message: "Resume upload failed",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadResume,
};
