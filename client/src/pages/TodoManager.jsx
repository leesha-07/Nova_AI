import "../styles/TodoManager.css";

export default function TodoManager() {
  return (
    <div className="todoPage">
      <div className="header">
        <h1>To-Do Manager</h1>
        <button>+ Add Task</button>
      </div>

      <div className="filters">
        <button className="active">All</button>
        <button>Today</button>
        <button>Completed</button>
        <button>High Priority</button>
      </div>

      <div className="taskContainer">
        <div className="pendingTasks">
          <h2>Pending Tasks</h2>

          <div className="taskCard">
            <h3>Complete React Dashboard</h3>
            <p>📅 Tomorrow</p>
            <span className="high">High Priority</span>
          </div>

          <div className="taskCard">
            <h3>Prepare DBMS Notes</h3>
            <p>📅 Friday</p>
            <span className="medium">Medium Priority</span>
          </div>

          <div className="taskCard">
            <h3>Update Resume</h3>
            <p>📅 Saturday</p>
            <span className="low">Low Priority</span>
          </div>
        </div>

        <div className="completedTasks">
          <h2>Completed Tasks</h2>

          <div className="taskCard completed">
            <h3>✔ Finish Login UI</h3>
          </div>

          <div className="taskCard completed">
            <h3>✔ Register UI</h3>
          </div>
        </div>
      </div>

      <div className="aiSuggestion">
        <h2>🤖 AI Suggestions</h2>

        <ul>
          <li>Finish your High Priority task first.</li>
          <li>You have 2 tasks due tomorrow.</li>
          <li>Completing React Dashboard will increase productivity.</li>
        </ul>
      </div>
    </div>
  );
}
