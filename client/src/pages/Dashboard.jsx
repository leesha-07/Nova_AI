import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* ================= NAVBAR ================= */}

      <div className="dashboardnavbar">
        <div className="dashboardlogo">Nova AI</div>

        <input
          className="dashboardsearch"
          type="text"
          placeholder="Search tasks, notes, chats..."
        />

        <div className="dashboardnav-right">
          <div className="dashboardnav-icon">🔔</div>
          <div className="dashboardnav-icon">👤</div>
        </div>
      </div>

      {/* ================= BODY ================= */}

      <div className="dashboard-body">
        {/* ================= SIDEBAR ================= */}

        <div className="dashboardsidebar">
          <h3 className="dashboardsidebar-title">Workspace</h3>

          <Link className="dashboardsidebar-link active" to="/dashboard">
            🏠 Dashboard
          </Link>

          <Link className="dashboardsidebar-link" to="/chat">
            💬 AI Chat
          </Link>

          <Link className="dashboardsidebar-link" to="/voice">
            🎤 Voice Assistant
          </Link>

          <Link className="dashboardsidebar-link" to="/notes">
            📝 Smart Notes
          </Link>

          <Link className="dashboardsidebar-link" to="/todo">
            ✅ To-Do Manager
          </Link>

          <Link className="dashboardsidebar-link" to="/reminder">
            ⏰ Reminders
          </Link>

          <Link className="dashboardsidebar-link" to="/pdf">
            📄 PDF Chat
          </Link>

          <Link className="dashboardsidebar-link" to="/email">
            📧 Email Writer
          </Link>

          <Link className="dashboardsidebar-link" to="/study">
            📚 Study Planner
          </Link>

          <Link className="dashboardsidebar-link" to="/resume">
            📑 Resume Analyzer
          </Link>

          <Link className="dashboardsidebar-link" to="/profile">
            👤 Profile
          </Link>

          <Link className="dashboardsidebar-link" to="/search">
            🌐 Search
          </Link>
        </div>

        {/* ================= MAIN ================= */}

        <div className="dashboardmain-content">
          {/* ================= TOP SECTION ================= */}

          <div className="dashboardrow">
            {/* Welcome */}

            <div className="dashboardwelcome-card">
              <span className="dashboardpage-tag">Productivity Dashboard</span>

              <h2> Welcome back, Leesha👋</h2>

              <p>
                Here's an overview of your productivity and today's priorities.
              </p>

              <div className="dashboardquote">
                <h4>💡 Today's Quote</h4>

                <p>"Small progress every day leads to big results."</p>
              </div>

              <div className="dashboardquick-stats">
                <div className="dashboardmini-card dashboardpending">
                  <div className="dashboardmini-icon">📝</div>
                  <h3>5</h3>
                  <span>Pending Tasks</span>
                </div>

                <div className="dashboardmini-card dashboardreminder">
                  <div className="dashboardmini-icon">⏰</div>
                  <h3>2</h3>
                  <span>Today's Reminders</span>
                </div>

                <div className="dashboardmini-card dashboardnotes">
                  <div className="dashboardmini-icon">📚</div>
                  <h3>12</h3>
                  <span>Notes Created</span>
                </div>

                <div className="dashboardmini-card dashboardstudy">
                  <div className="dashboardmini-icon">🎯</div>
                  <h3>3h</h3>
                  <span>Study Goal</span>
                </div>
              </div>
            </div>

            {/* Productivity */}

            <div className="dashboardstats-card">
              <h2>📈 Productivity</h2>

              <div className="dashboardscore-box">
                <div className="dashboardprogress-circle">
                  <h1>82%</h1>

                  <div className="dashboardprogress-bar">
                    <div className="dashboardprogress-fill"></div>
                  </div>

                  <span>Overall Productivity Score</span>
                </div>
              </div>

              <div className="dashboardstats-list">
                <p>✔ Completed Tasks : 18</p>

                <p>📚 Study Sessions : 7</p>

                <p>📝 Notes Created : 12</p>

                <p>⏳ Pending Tasks : 5</p>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM SECTION ================= */}

          <div className="dashboardrow">
            {/* Recent Tasks */}

            <div className="dashboardrecent-card">
              <h2>📋 Recent Tasks</h2>

              <div className="dashboardtask-card">
                🟢 Complete React Dashboard
              </div>

              <div className="dashboardtask-card">🟢 Finish Login UI</div>

              <div className="dashboardtask-card">
                🟡 Connect Backend Authentication
              </div>

              <div className="dashboardtask-card">🔵 Update Resume</div>

              <div className="dashboardtask-card">📚 Prepare DBMS Notes</div>
            </div>

            {/* Assistant */}

            <div className="dashboardassistant-card">
              <h2 className="dashboardassistant-header">
                🤖 Nova AI Assistant
              </h2>

              <div className="dashboardassistant-box">
                <p>👋 Good Evening, Leesha!</p>

                <h4>Today's Focus</h4>

                <p>• Finish React Dashboard</p>

                <p>• Review DBMS Notes</p>

                <p>• Complete Backend Authentication</p>

                <button className="dashboardassistant-btn">
                  ✨ Ask Nova AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
