const express = require("express");

const {
  saveSubscription,
  testPushNotification,
} = require("../controllers/pushController");

const router = express.Router();

router.get("/public-key", (req, res) => {
  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });
});

router.post("/subscribe", saveSubscription);

router.post("/test", testPushNotification);

module.exports = router;
