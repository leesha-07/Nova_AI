const express = require("express");

const {
  createPdf,
  updatePdf,
  getPdf,
  deletePdf,
  askPdfQuestion,
} = require("../controllers/pdfChatController");

const { upload, uploadPdf } = require("../controllers/pdfUploadController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/upload", protect, upload.single("pdf"), uploadPdf);

router.post("/", protect, createPdf);

router.get("/:userId", protect, getPdf);

router.put("/:pdfId", protect, updatePdf);

router.post("/ask/:pdfId", protect, askPdfQuestion);

router.delete("/:pdfId", protect, deletePdf);

module.exports = router;
