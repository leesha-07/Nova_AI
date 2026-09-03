const express = require("express");
const router = express.Router();
const {
  createEmail,
  getEmails,
  getEmail,
  updateEmail,
  deleteEmail,
} = require("../controllers/emailController");

router.post("/", createEmail);
router.get("/user/:userId", getEmails);
router.get("/:emailId", getEmail);
router.put("/:emailId", updateEmail);
router.delete("/:emailId", deleteEmail);
module.exports = router;
