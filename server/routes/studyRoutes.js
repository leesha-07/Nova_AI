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
router.post("/", createStudy);
router.get("/user/:userId", getStudys);
router.post("/generate", generateStudyPlan);
router.get("/:studyId", getStudy);
router.put("/:studyId", updateStudy);
router.delete("/:studyId", deleteStudy);
module.exports = router;
