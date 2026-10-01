const express = require("express");

const router = express.Router();

const {
  createStudy,
  getStudys,
  getStudy,
  updateStudy,
  deleteStudy,
  generateStudyPlan,
} = require("../controllers/studyController.js");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createStudy);

router.get("/user/:userId", protect, getStudys);

router.post("/generate", protect, generateStudyPlan);

router.get("/:studyId", protect, getStudy);

router.put("/:studyId", protect, updateStudy);

router.delete("/:studyId", protect, deleteStudy);

module.exports = router;
