const webpush = require("web-push");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

const sendPushNotification = (subscription, payload) => {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  };

  return webpush.sendNotification(pushSubscription, JSON.stringify(payload));
};

module.exports = {
  sendPushNotification,
};
