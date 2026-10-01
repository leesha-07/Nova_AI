const PushSubscription = require("../models/PushSubscription");
const { sendPushNotification } = require("../services/pushService");

const saveSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys) {
      return res.status(400).json({
        message: "Subscription data is required",
      });
    }

    const existingSubscription = await PushSubscription.findOne({
      userId,
      endpoint,
    });

    if (existingSubscription) {
      return res.status(200).json({
        message: "Subscription already exists",
        subscription: existingSubscription,
      });
    }

    const subscription = await PushSubscription.create({
      userId,
      endpoint,
      keys,
    });

    res.status(201).json({
      message: "Push subscription saved successfully",
      subscription,
    });
  } catch (error) {
    console.error("Save subscription error:", error);

    res.status(500).json({
      message: "Failed to save push subscription",
    });
  }
};

const testPushNotification = async (req, res) => {
  try {
    const userId = req.user.userId;

    const subscription = await PushSubscription.findOne({
      userId,
    });

    if (!subscription) {
      return res.status(404).json({
        message: "Push subscription not found",
      });
    }

    try {
      await sendPushNotification(subscription, {
        title: "Nova AI",
        message: "🔔 Test notification is working!",
      });
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await PushSubscription.deleteOne({
          _id: subscription._id,
        });

        return res.status(410).json({
          message: "Push subscription expired. Please subscribe again.",
        });
      }

      throw error;
    }

    res.status(200).json({
      message: "Test push notification sent successfully",
    });
  } catch (error) {
    console.error("Test push notification error:", error);

    res.status(500).json({
      message: "Failed to send test notification",
    });
  }
};

module.exports = {
  saveSubscription,
  testPushNotification,
};
