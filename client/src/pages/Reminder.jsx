import { useEffect, useState } from "react";
import "../styles/Reminder.css";
import { urlBase64ToUint8Array } from "../utils/vapid";

export default function Reminder() {
  const userId = localStorage.getItem("userId");

  const [notificationPermission, setNotificationPermission] = useState("");

  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(null);

  const [title, setTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setNotificationPermission(Notification.permission);
    getReminders();
  }, []);

  // =========================
  // GET REMINDERS
  // =========================

  async function getReminders() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reminder/user/${userId}`,
      );

      const data = await response.json();

      if (response.ok) {
        setReminders(data.reminders);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to get reminders:", error);
    }
  }

  // =========================
  // SELECT REMINDER
  // =========================

  function selectReminder(reminder) {
    setSelectedReminder(reminder);

    setTitle(reminder.title);
    setReminderDate(reminder.reminderDate.split("T")[0]);
    setReminderTime(reminder.reminderTime);
    setMessage(reminder.message || "");
  }

  // =========================
  // ADD NEW REMINDER
  // =========================

  function createNewReminder() {
    setSelectedReminder(null);

    setTitle("");
    setReminderDate("");
    setReminderTime("");
    setMessage("");
  }

  // =========================
  // SAVE / UPDATE REMINDER
  // =========================

  async function saveReminder() {
    if (!title || !reminderDate || !reminderTime) {
      return;
    }

    try {
      // UPDATE
      if (selectedReminder) {
        const response = await fetch(
          `http://localhost:5000/api/reminder/${selectedReminder._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: title,
              message: message,
              reminderDate: reminderDate,
              reminderTime: reminderTime,
              status: selectedReminder.status,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message);
          return;
        }

        setSelectedReminder(data.reminder);

        await getReminders();

        return;
      }

      // CREATE
      const response = await fetch("http://localhost:5000/api/reminder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          title: title,
          message: message,
          reminderDate: reminderDate,
          reminderTime: reminderTime,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setSelectedReminder(data.newReminder);

      await getReminders();
    } catch (error) {
      console.error("Failed to save reminder:", error);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function deleteReminder() {
    if (!selectedReminder) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reminder?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/reminder/${selectedReminder._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      createNewReminder();

      await getReminders();
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  }

  // =========================
  // MARK COMPLETED
  // =========================

  async function markCompleted() {
    if (!selectedReminder) {
      alert("Please select a reminder first.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/reminder/${selectedReminder._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: selectedReminder.title,
            message: selectedReminder.message,
            reminderDate: selectedReminder.reminderDate,
            reminderTime: selectedReminder.reminderTime,
            status: "completed",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      createNewReminder();

      await getReminders();
    } catch (error) {
      console.error("Failed to complete reminder:", error);
    }
  }

  // =========================
  // ENABLE NOTIFICATIONS
  // =========================

  async function requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();

      setNotificationPermission(permission);

      if (permission !== "granted") {
        alert("Notification permission was not granted.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const response = await fetch("http://localhost:5000/api/push/public-key");

      const data = await response.json();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      const saveResponse = await fetch(
        "http://localhost:5000/api/push/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.toJSON().keys.p256dh,
              auth: subscription.toJSON().keys.auth,
            },
          }),
        },
      );
    } catch (error) {
      console.error("Push notification error:", error);
    }
  }

  // =========================
  // DATE HELPERS
  // =========================

  function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getReminderDateTime(reminder) {
    const date = reminder.reminderDate.split("T")[0];

    return new Date(`${date}T${reminder.reminderTime}:00`);
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // =========================
  // UPCOMING REMINDERS
  // =========================

  const now = new Date();

  const upcomingReminders = reminders
    .filter((reminder) => {
      if (reminder.status !== "pending") {
        return false;
      }

      return getReminderDateTime(reminder) >= now;
    })
    .sort((a, b) => getReminderDateTime(a) - getReminderDateTime(b));

  // =========================
  // TODAY'S SCHEDULE
  // =========================

  const todayDate = getTodayDate();

  const todaysReminders = reminders
    .filter((reminder) => {
      return reminder.reminderDate.split("T")[0] === todayDate;
    })
    .sort((a, b) => getReminderDateTime(a) - getReminderDateTime(b));

  return (
    <div className="reminder">
      {/* =========================
          HEADER
      ========================= */}

      <div className="reminderHeader">
        <div className="reminderLogo">
          <span>✨</span>
          Nova AI
        </div>
        <h2>Reminder Manager</h2>

        <button onClick={createNewReminder}>+ Add Reminder</button>
      </div>

      {/* =========================
          NOTIFICATION STATUS
      ========================= */}

      <div className="notificationStatus">
        <div>
          <span className="notificationIcon">🔔</span>

          <div>
            <strong>Browser Notifications</strong>

            <p>
              {notificationPermission === "granted"
                ? "Notifications are enabled"
                : "Enable notifications to receive reminders"}
            </p>
          </div>
        </div>

        {notificationPermission !== "granted" && (
          <button onClick={requestNotificationPermission}>
            Enable Notifications
          </button>
        )}

        {notificationPermission === "granted" && (
          <span className="notificationEnabled">✓ Enabled</span>
        )}
      </div>

      {/* =========================
          MAIN
      ========================= */}

      <div className="reminderMaincontent">
        {/* =========================
            UPCOMING
        ========================= */}

        <div className="reminderleftcard">
          <div className="reminderCardHeader">
            <div>
              <h2>Upcoming Reminders</h2>
              <p>Your next reminders</p>
            </div>

            <span className="reminderCount">{upcomingReminders.length}</span>
          </div>

          <div className="upcomingReminderList">
            {upcomingReminders.length === 0 ? (
              <div className="emptyReminder">
                <div>📭</div>
                <h3>No upcoming reminders</h3>
                <p>Add a reminder to stay organized.</p>
              </div>
            ) : (
              upcomingReminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className={`upcomingReminderItem ${
                    selectedReminder?._id === reminder._id
                      ? "selectedReminder"
                      : ""
                  }`}
                  onClick={() => selectReminder(reminder)}
                >
                  <div className="reminderItemIcon">⏰</div>

                  <div className="reminderItemContent">
                    <strong>{reminder.title}</strong>

                    <p>{formatDate(reminder.reminderDate)}</p>

                    <span>{formatTime(reminder.reminderTime)}</span>
                  </div>

                  <div className="reminderArrow">›</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =========================
            TODAY
        ========================= */}

        <div className="reminderrightcard">
          <div className="reminderCardHeader">
            <div>
              <h2>Today's Schedule</h2>
              <p>Everything planned for today</p>
            </div>

            <span className="todayBadge">Today</span>
          </div>

          <div className="todaySchedule">
            {todaysReminders.length === 0 ? (
              <div className="emptyReminder">
                <div>☀️</div>
                <h3>Your day is clear</h3>
                <p>No reminders scheduled for today.</p>
              </div>
            ) : (
              todaysReminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="scheduleItem"
                  onClick={() => selectReminder(reminder)}
                >
                  <div className="scheduleTime">
                    {formatTime(reminder.reminderTime)}
                  </div>

                  <div className="scheduleLine">
                    <span></span>
                  </div>

                  <div className="scheduleContent">
                    <strong>{reminder.title}</strong>

                    {reminder.message && <p>{reminder.message}</p>}

                    <span className={`statusBadge ${reminder.status}`}>
                      {reminder.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* =========================
            DETAILS
        ========================= */}

        <div className="reminderbottomcard">
          <div className="detailsHeader">
            <div>
              <h2>{selectedReminder ? "Edit Reminder" : "Create Reminder"}</h2>

              <p>
                {selectedReminder
                  ? "Update your reminder details"
                  : "Add something you don't want to forget"}
              </p>
            </div>
          </div>

          <div className="remindersec">
            <div className="formGroup">
              <label>Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you need to remember?"
              />
            </div>

            <div className="dateTimeRow">
              <div className="formGroup">
                <label>Date</label>

                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>

              <div className="formGroup">
                <label>Time</label>

                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>

            <div className="formGroup">
              <label>Notes</label>

              <textarea
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add some details..."
              ></textarea>
            </div>
          </div>

          <div className="reminderActionButtons">
            {selectedReminder && (
              <>
                <button
                  className="deleteReminderButton"
                  onClick={deleteReminder}
                >
                  🗑 Delete
                </button>

                {selectedReminder.status !== "completed" && (
                  <button
                    className="completeReminderButton"
                    onClick={markCompleted}
                  >
                    ✓ Mark Completed
                  </button>
                )}
              </>
            )}

            <button className="saveReminderButton" onClick={saveReminder}>
              💾 {selectedReminder ? "Update Reminder" : "Save Reminder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
