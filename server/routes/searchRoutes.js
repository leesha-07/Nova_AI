const express = require("express");

const { smartSearch } = require("../controllers/searchController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId", protect, smartSearch);

module.exports = router;
