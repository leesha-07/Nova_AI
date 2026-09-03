const express = require("express");

const { smartSearch } = require("../controllers/searchController");

const router = express.Router();

router.get("/:userId", smartSearch);

module.exports = router;
