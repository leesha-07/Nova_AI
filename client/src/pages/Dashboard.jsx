import "../styles/Dashboard.css";
export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="navbar">
        <div>Nova AI</div>
        <div>Search </div>
        <div>Notification</div>
        <div>Profile</div>
      </div>
      <div className="dashboard-body">
        <div className="sidebar">
          <div>Dashboard</div>
          <div>AI Chat</div>
          <div>Voice Assistant</div>
          <div>Smart Notes</div>
          <div>To-Do Manager</div>
          <div>Reminders</div>
          <div>PDF Chat</div>
          <div>Email Writer</div>
          <div>Study Planner</div>
          <div>Resume Analyzer</div>
          <div>Profile</div>
        </div>
        <div className="main-content">
          <div className="welcome-card">Welcome Card</div>
          <div className="stats-cards">Statistics Card</div>
          <div className="recent-tasks">Recent Tasks</div>
          <div className="assistant-panel">Ai Assistant</div>
        </div>
      </div>
    </div>
  );
}
