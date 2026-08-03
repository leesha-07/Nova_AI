import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div className="logo">Nova AI</div>

        <input
          className="search"
          type="text"
          placeholder="Search tasks, notes, chats..."
        />

        <div className="nav-right">
          <div className="nav-icon">🔔</div>
          <div className="nav-icon">👤</div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="sidebar">
          <h3 className="sidebar-title">Workspace</h3>

          <Link className="sidebar-link active" to="/dashboard">
            🏠 Dashboard
          </Link>

          <Link className="sidebar-link" to="/chat">
            💬 AI Chat
          </Link>

          <Link className="sidebar-link" to="/voice">
            🎤 Voice Assistant
          </Link>

          <Link className="sidebar-link" to="/notes">
            📝 Smart Notes
          </Link>

          <Link className="sidebar-link" to="/todo">
            ✅ To-Do Manager
          </Link>

          <Link className="sidebar-link" to="/reminder">
            ⏰ Reminders
          </Link>

          <Link className="sidebar-link" to="/pdf">
            📄 PDF Chat
          </Link>

          <Link className="sidebar-link" to="/email">
            📧 Email Writer
          </Link>

          <Link className="sidebar-link" to="/study">
            📚 Study Planner
          </Link>

          <Link className="sidebar-link" to="/resume">
            📑 Resume Analyzer
          </Link>

          <Link className="sidebar-link" to="/profile">
            👤 Profile
          </Link>

          <Link className="sidebar-link" to="/search">
            🌐 Search
          </Link>
        </div>

        <div className="main-content">
          <div className="row">
            <div className="welcome-card">
              <span className="page-tag">Productivity Dashboard</span>

              <h2>👋 Welcome back, Leesha!</h2>

              <p>Here's your productivity summary for today.</p>
              <p>Today's Quote </p>
              <p>"Small progress every day leads to big results."</p>
              <div className="quick-stats">
                <div className="mini-card pending">
                  <h3>5</h3>
                  <span>Pending Tasks</span>
                </div>

                <div className="mini-card reminder">
                  <h3>2</h3>
                  <span>Today's Reminders</span>
                </div>

                <div className="mini-card notes">
                  <h3>12</h3>
                  <span>Notes</span>
                </div>

                <div className="mini-card study">
                  <h3>3h</h3>
                  <span>Study Goal</span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h2>📈 Productivity</h2>

              <div className="score-box">
                <div className="progress-circle">
                  <h1>82%</h1>
                  <span>Here's your productivity summary for today.</span>
                  <br></br>
                  <span>Overall Score</span>
                </div>
              </div>

              <div className="stats-list">
                <p>✔ Completed Tasks : 18</p>
                <p>📚 Study Sessions : 7</p>
                <p>📝 Notes Created : 12</p>
                <p>⏳ Pending Tasks : 5</p>
              </div>
            </div>
          </div>

          {/* Bottom */}

          <div className="row">
            <div className="recent-card">
              <h2>📋 Recent Tasks</h2>

              <div className="task-card">✔ Complete React Dashboard</div>

              <div className="task-card">✔ Finish Login UI</div>

              <div className="task-card">⏳ Connect Backend Authentication</div>

              <div className="task-card">📄 Update Resume</div>

              <div className="task-card">📚 Prepare DBMS Notes</div>
            </div>

            <div className="assistant-card">
              <div className="assistant-header">🤖 Nova AI Assistant</div>

              <div className="assistant-box">
                <p>Good Evening, Leesha! 👋</p>

                <p>You still have 5 pending tasks.</p>

                <p>
                  Shall I organize today's schedule and suggest what to complete
                  first?
                </p>

                <button className="assistant-btn">✨ Ask Nova AI</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
