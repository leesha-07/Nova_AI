const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const PushSubscription = require("../models/PushSubscription");
const { sendPushNotification } = require("./pushService");

const startReminderScheduler = () => {
  console.log("Reminder scheduler started...");

  // Runs every minute
  cron.schedule(
    "* * * * *",
    async () => {
      try {
        const now = new Date();

        // Get current Indian date and time
        const indianDate = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now);

        const indianTime = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now);

        console.log(`Checking reminders: ${indianDate} ${indianTime}`);

        const startOfDay = new Date(`${indianDate}T00:00:00.000+05:30`);

        const endOfDay = new Date(`${indianDate}T23:59:59.999+05:30`);

        // Find reminders that are pending and scheduled
        // for the current Indian date and minute.
        const reminders = await Reminder.find({
          status: "pending",
          reminderTime: indianTime,
          reminderDate: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

        if (reminders.length === 0) {
          return;
        }

        console.log(
          `Found ${reminders.length} reminder(s) for ${indianDate} ${indianTime}`,
        );

        for (const reminder of reminders) {
          let subscription = null;

          try {
            subscription = await PushSubscription.findOne({
              userId: reminder.userId,
            });

            if (!subscription) {
              console.log(
                `No push subscription found for user ${reminder.userId}`,
              );
              continue;
            }

            await sendPushNotification(subscription, {
              title: reminder.title || "Nova AI Reminder",
              message:
                reminder.message || `You have a reminder: ${reminder.title}`,
            });

            reminder.status = "sent";
            await reminder.save();

            console.log(`Reminder sent successfully: ${reminder.title}`);
          } catch (error) {
            console.error(
              `Failed to send reminder "${reminder.title}":`,
              error.message,
            );

            // Browser subscription expired or became invalid
            if (
              subscription &&
              (error.statusCode === 404 || error.statusCode === 410)
            ) {
              await PushSubscription.deleteOne({
                _id: subscription._id,
              });

              console.log("Expired push subscription removed.");
            }
          }
        }
      } catch (error) {
        console.error("Reminder scheduler error:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
};

module.exports = {
  startReminderScheduler,
};
