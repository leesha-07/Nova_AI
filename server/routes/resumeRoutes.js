const express = require("express");

const {
  upload,
  uploadResume,
} = require("../controllers/resumeUploadController");

const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  analyzeResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createResume);

router.post("/upload", protect, upload.single("resume"), uploadResume);

router.get("/user/:userId", protect, getResumes);

router.get("/:resumeId", protect, getResume);

router.put("/:resumeId", protect, updateResume);

router.delete("/:resumeId", protect, deleteResume);

router.put("/:resumeId/analyze", protect, analyzeResume);

module.exports = router;
