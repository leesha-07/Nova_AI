import "../styles/Reminder.css";
export default function Reminder() {
  return (
    <div className="reminder">
      <div className="reminderHeader">
        <h1>Nova AI</h1>

        <h2>Reminder Manager</h2>

        <button>+ Add Reminder</button>
      </div>
      <div className="reminderMaincontent">
        <div className="reminderleftcard">
          <h2>Upcoming Reminders</h2>
          <div className="remindersection">
            <p>
              <strong>⏰ Team Meeting</strong>
            </p>
            <p>Today • 10:00 AM</p>
            <p>
              <strong>📚Assignment</strong>
            </p>
            <p>Today • 6:00 PM</p>
            <p>
              <strong>💊 Medicine</strong>
            </p>
            <p>Today • 9:00 PM</p>
            <p>
              <strong>📝 Project Submission</strong>
            </p>
            <p>Tomorrow • 11:59 PM</p>
          </div>
        </div>
        <div className="reminderrightcard">
          <h2>Today's Schedule</h2>
          <div className="remindersection">
            <p>
              <strong>🕘9 am</strong>
            </p>
            <p>Morning Workout</p>
            <p>
              <strong>🕘2pm</strong>
            </p>
            <p>Morning Workout</p>
            <p>
              <strong>🕘6 pm</strong>
            </p>
            <p>Study Session</p>
          </div>
        </div>
        <div className="reminderbottomcard">
          <h2>Reminder Details</h2>
          <div className="remindersec">
            <label>Title</label>
            <input type="text"></input>
            <label>Date</label>
            <input type="date"></input>
            <label>Time</label>
            <input type="time"></input>
            <label>Notes</label>
            <textarea
              placeholder="Write Your notes here..."
              rows="8"
            ></textarea>
          </div>
        </div>
        <div className="reminderbottombuttons">
          <div className="reminderbuttons">
            <button>💾 Save Reminder</button>
            <button>🗑 Delete</button>
            <button>✅ Mark Completed</button>
          </div>
        </div>
      </div>
    </div>
  );
}
