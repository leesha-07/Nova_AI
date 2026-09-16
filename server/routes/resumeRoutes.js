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

const router = express.Router();

router.post("/", createResume);
router.post("/upload", upload.single("resume"), uploadResume);
router.get("/user/:userId", getResumes);

router.get("/:resumeId", getResume);

router.put("/:resumeId", updateResume);

router.delete("/:resumeId", deleteResume);

router.put("/:resumeId/analyze", analyzeResume);
router.post("/upload", upload.single("resume"), uploadResume);
module.exports = router;
