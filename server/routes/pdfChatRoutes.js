const express = require("express");

const {
  createPdf,
  updatePdf,
  getPdf,
  deletePdf,
  askPdfQuestion,
} = require("../controllers/pdfChatController");

const { upload, uploadPdf } = require("../controllers/pdfUploadController");

const router = express.Router();

router.post("/upload", upload.single("pdf"), uploadPdf);

router.post("/", createPdf);

router.get("/:userId", getPdf);

router.put("/:pdfId", updatePdf);

router.post("/ask/:pdfId", askPdfQuestion);

router.delete("/:pdfId", deletePdf);

module.exports = router;
