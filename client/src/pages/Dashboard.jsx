import "../styles/Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile from "./Profile";
import API_BASE_URL from "../config/api";
export default function Dashboard() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [dashboard, setDashboard] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  // =========================
  // GET DASHBOARD
  // =========================

  async function getDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setDashboard(data.dashboard);
      } else if (response.status === 401) {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId && token) {
      getDashboard();
    } else {
      navigate("/login");
    }
  }, [userId, token, navigate]);

  // =========================
  // SEARCH
  // =========================

  async function handleSearch() {
    if (!search.trim()) {
      setSearchResults(null);
      setSearchOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search/${userId}?query=${encodeURIComponent(
          search.trim(),
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.results);
        setSearchOpen(true);
      } else if (response.status === 401) {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  function clearSearch() {
    setSearch("");
    setSearchResults(null);
    setSearchOpen(false);
  }

  function handleSearchResultClick(type) {
    if (type === "todo") {
      navigate("/todo");
    }

    if (type === "note") {
      navigate("/notes");
    }

    if (type === "pdf") {
      navigate("/pdf");
    }

    if (type === "email") {
      navigate("/email");
    }

    if (type === "reminder") {
      navigate("/reminder");
    }

    if (type === "study") {
      navigate("/study");
    }

    if (type === "resume") {
      navigate("/resume");
    }

    setSearchOpen(false);
  }

  // =========================
  // NOTIFICATIONS
  // =========================

  async function handleNotification() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reminder/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        const pendingNotifications = data.reminders.filter(
          (reminder) => reminder.status === "pending",
        );

        setNotifications(pendingNotifications);
        setNotificationsOpen((previous) => !previous);
      } else if (response.status === 401) {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Notification error:", error);
    }
  }

  // =========================
  // ASK NOVA
  // =========================

  function handleAskNova() {
    navigate("/chat");
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="dashboard-navbar">
        {/* Logo */}

        <div className="dashboard-logo">
          ✨<span>Nova AI</span>
        </div>

        {/* Search */}

        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search your notes, tasks, PDFs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              if (searchResults) {
                setSearchOpen(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }

              if (e.key === "Escape") {
                setSearchOpen(false);
              }
            }}
          />

          {search && (
            <button className="dashboard-search-clear" onClick={clearSearch}>
              ✕
            </button>
          )}

          <button className="dashboard-search-button" onClick={handleSearch}>
            🔍
          </button>

          {/* =====================================
              SEARCH RESULTS DROPDOWN
          ===================================== */}

          {searchOpen && searchResults && (
            <div className="dashboard-search-dropdown">
              <div className="dashboard-search-dropdown-header">
                <h3>Search Results</h3>

                <button onClick={clearSearch}>Clear</button>
              </div>

              {/* Tasks */}

              {searchResults.todos?.length > 0 && (
                <div className="dashboard-search-section">
                  <h4>✅ Tasks</h4>

                  {searchResults.todos.map((todo) => (
                    <button
                      className="dashboard-search-item"
                      key={todo._id}
                      onClick={() => handleSearchResultClick("todo")}
                    >
                      <span>{todo.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Notes */}

              {searchResults.notes?.length > 0 && (
                <div className="dashboard-search-section">
                  <h4>📝 Notes</h4>

                  {searchResults.notes.map((note) => (
                    <button
                      className="dashboard-search-item"
                      key={note._id}
                      onClick={() => handleSearchResultClick("note")}
                    >
                      <span>{note.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* PDFs */}

              {searchResults.pdfs?.length > 0 && (
                <div className="dashboard-search-section">
                  <h4>📄 PDFs</h4>

                  {searchResults.pdfs.map((pdf) => (
                    <button
                      className="dashboard-search-item"
                      key={pdf._id}
                      onClick={() => handleSearchResultClick("pdf")}
                    >
                      <span>{pdf.fileName}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Emails */}

              {searchResults.emails?.length > 0 && (
                <div className="dashboard-search-section">
                  <h4>✉️ Emails</h4>

                  {searchResults.emails.map((email) => (
                    <button
                      className="dashboard-search-item"
                      key={email._id}
                      onClick={() => handleSearchResultClick("email")}
                    >
                      <span>{email.subject}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Reminders */}

              {searchResults.reminders?.length > 0 && (
                <div className="dashboard-search-section">
                  <h4>⏰ Reminders</h4>

                  {searchResults.reminders.map((reminder) => (
                    <button
                      className="dashboard-search-item"
                      key={reminder._id}
                      onClick={() => handleSearchResultClick("reminder")}
                    >
                      <span>{reminder.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Study Plans */}

              {searchResults.studies?.length > 0 && (
                <div className="dashboard-search-section">
                  <h4>📚 Study Plans</h4>

                  {searchResults.studies.map((study) => (
                    <button
                      className="dashboard-search-item"
                      key={study._id}
                      onClick={() => handleSearchResultClick("study")}
                    >
                      <span>{study.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Resumes */}

              {searchResults.resumes?.length > 0 && (
                <div className="dashboard-search-section">
                  <h4>📑 Resumes</h4>

                  {searchResults.resumes.map((resume) => (
                    <button
                      className="dashboard-search-item"
                      key={resume._id}
                      onClick={() => handleSearchResultClick("resume")}
                    >
                      <span>{resume.fileName}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}

              {!searchResults.todos?.length &&
                !searchResults.notes?.length &&
                !searchResults.pdfs?.length &&
                !searchResults.emails?.length &&
                !searchResults.reminders?.length &&
                !searchResults.studies?.length &&
                !searchResults.resumes?.length && (
                  <div className="dashboard-no-search-results">
                    <span>🔎</span>
                    <p>No results found</p>
                    <small>Try searching for another keyword.</small>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Navbar Actions */}

        <div className="dashboard-nav-actions">
          {/* Notifications */}

          <div className="dashboard-notification-wrapper">
            <button
              className="dashboard-notification-btn"
              onClick={handleNotification}
            >
              🔔
            </button>

            {notificationsOpen && (
              <div className="dashboard-notification-dropdown">
                <div className="dashboard-notification-header">
                  <h3>Notifications</h3>

                  <button onClick={() => setNotificationsOpen(false)}>✕</button>
                </div>

                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      className="dashboard-notification-item"
                      key={notification._id}
                    >
                      <div className="dashboard-notification-icon">⏰</div>

                      <div className="dashboard-notification-content">
                        <strong>{notification.title}</strong>

                        <p>{notification.message}</p>

                        <span>
                          {notification.reminderDate
                            ? new Date(
                                notification.reminderDate,
                              ).toLocaleDateString()
                            : ""}{" "}
                          {notification.reminderTime || ""}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-no-notifications">
                    <p>🎉 No pending notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}

          <button
            className="dashboard-profile-btn"
            onClick={() => {
              setProfileOpen((previous) => !previous);
              setNotificationsOpen(false);
            }}
          >
            👤
          </button>
        </div>
      </nav>

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="dashboard-sidebar">
        <Link to="/dashboard" className="dashboard-sidebar-link active">
          🏠 Dashboard
        </Link>

        <Link to="/chat" className="dashboard-sidebar-link">
          🤖 AI Chat
        </Link>

        <Link to="/voice" className="dashboard-sidebar-link">
          🎙️ Voice Assistant
        </Link>

        <Link to="/notes" className="dashboard-sidebar-link">
          📝 Smart Notes
        </Link>

        <Link to="/todo" className="dashboard-sidebar-link">
          ✅ To-Do Manager
        </Link>

        <Link to="/reminder" className="dashboard-sidebar-link">
          ⏰ Reminders
        </Link>

        <Link to="/pdf" className="dashboard-sidebar-link">
          📄 PDF Chat
        </Link>

        <Link to="/email" className="dashboard-sidebar-link">
          ✉️ Email Writer
        </Link>

        <Link to="/study" className="dashboard-sidebar-link">
          📚 Study Planner
        </Link>

        <Link to="/resume" className="dashboard-sidebar-link">
          📑 Resume Analyzer
        </Link>
      </aside>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="dashboard-main">
        {/* Welcome */}

        <div className="dashboard-welcome-card">
          <div>
            <p className="dashboard-small-title">Welcome back 👋</p>

            <h1>Good to see you again!</h1>

            <p>Stay productive and let Nova AI help you manage your day.</p>
          </div>

          <button className="dashboard-welcome-btn" onClick={handleAskNova}>
            ✨ Ask Nova AI
          </button>
        </div>

        {/* =====================================
            QUICK STATS
        ===================================== */}

        <div className="dashboardquick-stats">
          <div className="dashboardmini-card dashboardpending">
            <div className="dashboardmini-icon">📝</div>

            <h3>{dashboard?.todos?.pending || 0}</h3>

            <span>Pending Tasks</span>
          </div>

          <div className="dashboardmini-card dashboardreminder">
            <div className="dashboardmini-icon">⏰</div>

            <h3>{dashboard?.reminders?.pending || 0}</h3>

            <span>Today's Reminders</span>
          </div>

          <div className="dashboardmini-card dashboardnotes">
            <div className="dashboardmini-icon">📚</div>

            <h3>{dashboard?.notes || 0}</h3>

            <span>Notes Created</span>
          </div>

          <div className="dashboardmini-card dashboardstudy">
            <div className="dashboardmini-icon">🎯</div>

            <h3>{dashboard?.studyPlans || 0}</h3>

            <span>Study Goals</span>
          </div>
        </div>

        {/* =====================================
            PRODUCTIVITY + RECENT TASKS
        ===================================== */}

        <div className="dashboard-grid">
          {/* Productivity */}

          <div className="dashboard-productivity-card">
            <h2>📊 Productivity</h2>

            <div className="dashboard-productivity-score">
              <h1>{dashboard?.productivity || 0}%</h1>

              <span>Overall productivity</span>
            </div>

            <div className="dashboardprogress-bar">
              <div
                className="dashboardprogress-fill"
                style={{
                  width: `${dashboard?.productivity || 0}%`,
                }}
              ></div>
            </div>

            <div className="dashboard-productivity-details">
              <p>✔ Completed Tasks : {dashboard?.todos?.completed || 0}</p>

              <p>📚 Study Plans : {dashboard?.studyPlans || 0}</p>

              <p>📝 Notes Created : {dashboard?.notes || 0}</p>

              <p>⏳ Pending Tasks : {dashboard?.todos?.pending || 0}</p>
            </div>
          </div>

          {/* Recent Tasks */}

          <div className="dashboardrecent-card">
            <h2>📋 Recent Tasks</h2>

            {dashboard?.recentTodos?.length > 0 ? (
              dashboard.recentTodos.map((todo) => (
                <div className="dashboardtask-card" key={todo._id}>
                  <span>{todo.completed ? "🟢" : "🟡"}</span>

                  <span>{todo.title}</span>
                </div>
              ))
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        </div>

        {/* =====================================
            NOVA ASSISTANT
        ===================================== */}

        <div className="dashboardassistant-card">
          <h2 className="dashboardassistant-header">🤖 Nova AI Assistant</h2>

          <div className="dashboardassistant-box">
            <p>👋 Your productivity assistant is ready.</p>

            <h4>Today's Overview</h4>

            <p>• Pending Tasks: {dashboard?.todos?.pending || 0}</p>

            <p>• Pending Reminders: {dashboard?.reminders?.pending || 0}</p>

            <p>• Study Plans: {dashboard?.studyPlans || 0}</p>

            <button className="dashboardassistant-btn" onClick={handleAskNova}>
              ✨ Ask Nova AI
            </button>
          </div>
        </div>
      </main>

      {/* =====================================
          PROFILE POPUP
      ===================================== */}

      {profileOpen && <Profile />}
    </div>
  );
}
