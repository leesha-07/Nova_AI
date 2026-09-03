const express = require("express");
const router = express.Router();
const {
  createStudy,
  getStudys,
  getStudy,
  updateStudy,
  deleteStudy,
} = require("../controllers/studyController.js");
router.post("/", createStudy);
router.get("/user/:userId", getStudys);
router.get("/:studyId", getStudy);
router.put("/:studyId", updateStudy);
router.delete("/:studyId", deleteStudy);
module.exports = router;
