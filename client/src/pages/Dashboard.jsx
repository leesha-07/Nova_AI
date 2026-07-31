import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">Nova AI</div>

        <input className="search" type="text" placeholder="Search..." />

        <div className="nav-icon">🔔</div>
        <div className="nav-icon">👤</div>
      </div>

      {/* Dashboard Body */}
      <div className="dashboard-body">
        {/* Sidebar */}
        <div className="sidebar">
          <Link className="sidebar-link" to="/dashboard">
            Dashboard
          </Link>

          <Link className="sidebar-link" to="/chat">
            AI Chat
          </Link>

          <Link className="sidebar-link" to="/voice">
            Voice Assistant
          </Link>

          <Link className="sidebar-link" to="/notes">
            Smart Notes
          </Link>

          <Link className="sidebar-link" to="/todo">
            To-Do Manager
          </Link>

          <Link className="sidebar-link" to="/reminder">
            Reminders
          </Link>

          <Link className="sidebar-link" to="/pdf">
            PDF Chat
          </Link>

          <Link className="sidebar-link" to="/email">
            Email Writer
          </Link>

          <Link className="sidebar-link" to="/study">
            Study Planner
          </Link>

          <Link className="sidebar-link" to="/resume">
            Resume Analyzer
          </Link>

          <Link className="sidebar-link" to="/profile">
            Profile
          </Link>

          <Link className="sidebar-link" to="/search">
            Search
          </Link>
        </div>

        {/* Main Content */}

        <div className="main-content">
          <div className="row">
            <div className="welcome-card">
              <h2>Welcome back, Leesha! 👋</h2>

              <p>Ready to boost your productivity today?</p>

              <p>Pending Tasks : 5</p>

              <p>Today's Reminders : 2</p>

              <p>Notes Created : 12</p>

              <p>Study Goal : 3 Hours</p>
            </div>

            <div className="stats-card">
              <h2>Productivity Statistics</h2>

              <p>Completed Tasks : 18</p>

              <p>Pending Tasks : 5</p>

              <p>Notes Created : 12</p>

              <p>Study Sessions : 7</p>

              <p>Productivity Score : 82%</p>
            </div>
          </div>

          <div className="row">
            <div className="recent-card">
              <h2>Recent Tasks</h2>

              <p>✔ Complete React Dashboard</p>

              <p>✔ Finish Login & Register UI</p>

              <p>⏳ Connect Backend Authentication</p>

              <p>📄 Update Resume</p>

              <p>📚 Prepare DBMS Notes</p>
            </div>

            <div className="assistant-card">
              <h2>Nova AI Assistant</h2>

              <p>💬 Answer Questions</p>

              <p>📝 Summarize Notes</p>

              <p>📄 Analyze PDFs</p>

              <p>📧 Write Emails</p>

              <p>📅 Plan Study</p>

              <p>🎯 Manage Daily Tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
