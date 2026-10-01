const express = require("express");

const {
  saveSubscription,
  testPushNotification,
} = require("../controllers/pushController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/public-key", (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
});

router.post("/subscribe", protect, saveSubscription);

router.post("/test", protect, testPushNotification);

module.exports = router;
