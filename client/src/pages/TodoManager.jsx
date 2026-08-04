import "../styles/TodoManager.css";

export default function TodoManager() {
  return (
    <div className="todoPage">
      <div className="todoheader">
        <h1>Nova AI</h1>
        <h2>To-Do Manager</h2>
        <button>+ Add Task</button>
      </div>

      <div className="todoMain">
        <div className="todofilters">
          <button className="todoactive">All</button>
          <button>Today</button>
          <button>Completed</button>
          <button>High Priority</button>
        </div>

        <div className="todotaskContainer">
          <div className="todopendingTasks">
            <h2>Pending Tasks</h2>

            <div className="todotaskCard">
              <h3>Complete React Dashboard</h3>
              <p>📅 Tomorrow</p>
              <span className="todohigh">High Priority</span>
            </div>

            <div className="todotaskCard">
              <h3>Prepare DBMS Notes</h3>
              <p>📅 Friday</p>
              <span className="todomedium">Medium Priority</span>
            </div>

            <div className="todotaskCard">
              <h3>Update Resume</h3>
              <p>📅 Saturday</p>
              <span className="todolow">Low Priority</span>
            </div>
          </div>

          <div className="todocompletedTasks">
            <h2>Completed Tasks</h2>

            <div className="todotaskCard completed">
              <h3>✔ Finish Login UI</h3>
            </div>

            <div className="todotaskCard completed">
              <h3>✔ Register UI</h3>
            </div>
          </div>
        </div>

        <div className="todoaiSuggestion">
          <h2>🤖 AI Suggestions</h2>

          <ul>
            <li>Finish your High Priority task first.</li>
            <li>You have 2 tasks due tomorrow.</li>
            <li>Completing React Dashboard will increase productivity.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
