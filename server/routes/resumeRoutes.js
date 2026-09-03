const express = require("express");

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

router.get("/user/:userId", getResumes);

router.get("/:resumeId", getResume);

router.put("/:resumeId", updateResume);

router.delete("/:resumeId", deleteResume);

router.put("/:resumeId/analyze", analyzeResume);

module.exports = router;
