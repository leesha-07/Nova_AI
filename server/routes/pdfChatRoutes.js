const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const {
  createPdf,
  updatePdf,
  getPdf,
  deletePdf,
} = require("../controllers/pdfChatController");

router.post("/", createPdf);
router.get("/:userId", getPdf);
router.put("/:pdfId", updatePdf);
router.delete("/:pdfId", deletePdf);
module.exports = router;
