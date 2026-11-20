import { useState } from "react";
import "../styles/Search.css";
import API_BASE_URL from "../config/api";
export default function Search() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/search/${userId}?query=${encodeURIComponent(
          query,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        setSearchResults(null);
        return;
      }

      setSearchResults(data.results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleNewSearch() {
    setQuery("");
    setSearchResults(null);
  }

  function getResultCount() {
    if (!searchResults) {
      return 0;
    }

    return (
      (searchResults.todos?.length || 0) +
      (searchResults.notes?.length || 0) +
      (searchResults.pdfs?.length || 0) +
      (searchResults.emails?.length || 0) +
      (searchResults.reminders?.length || 0) +
      (searchResults.studies?.length || 0) +
      (searchResults.resumes?.length || 0)
    );
  }

  return (
    <div className="search">
      {/* =========================
          HEADER
      ========================= */}

      <div className="searchHeader">
        <div>
          <h1>Nova AI</h1>
          <p>Find everything in one place</p>
        </div>

        <h2>Unified Smart Search</h2>

        <button onClick={handleNewSearch}>New Search</button>
      </div>

      {/* =========================
          MAIN
      ========================= */}

      <div className="searchMain">
        {/* =========================
            SEARCH INPUT
        ========================= */}

        <div className="searchinputcard">
          <div className="searchInputWrapper">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Search notes, tasks, reminders, PDFs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button onClick={handleSearch}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* =========================
            RESULTS
        ========================= */}

        <div className="searchresultcard">
          <div className="searchResultHeader">
            <div>
              <h2>Search Results</h2>

              {searchResults && (
                <p className="resultCount">
                  {getResultCount()} result
                  {getResultCount() !== 1 ? "s" : ""} found
                </p>
              )}
            </div>

            {searchResults && <span className="searchQuery">"{query}"</span>}
          </div>

          {!searchResults && !loading && (
            <div className="searchEmpty">
              <div className="searchEmptyIcon">🔎</div>

              <h3>Search across Nova AI</h3>

              <p>
                Find your notes, tasks, reminders, PDFs, emails and study plans
                from one place.
              </p>
            </div>
          )}

          {loading && (
            <div className="searchEmpty">
              <div className="searchEmptyIcon">⏳</div>

              <h3>Searching...</h3>

              <p>Looking through your Nova AI data.</p>
            </div>
          )}

          {searchResults && !loading && (
            <div className="searchResults">
              {/* TODOS */}

              {searchResults.todos?.length > 0 && (
                <div className="resultGroup">
                  <h3>✅ Tasks</h3>

                  {searchResults.todos.map((todo) => (
                    <div className="searchResultItem" key={todo._id}>
                      <strong>{todo.title}</strong>

                      {todo.content && <p>{todo.content}</p>}

                      {todo.status && <span>Status: {todo.status}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* NOTES */}

              {searchResults.notes?.length > 0 && (
                <div className="resultGroup">
                  <h3>📝 Notes</h3>

                  {searchResults.notes.map((note) => (
                    <div className="searchResultItem" key={note._id}>
                      <strong>{note.title}</strong>

                      {note.content && <p>{note.content}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* REMINDERS */}

              {searchResults.reminders?.length > 0 && (
                <div className="resultGroup">
                  <h3>🔔 Reminders</h3>

                  {searchResults.reminders.map((reminder) => (
                    <div className="searchResultItem" key={reminder._id}>
                      <strong>{reminder.title}</strong>

                      {reminder.message && <p>{reminder.message}</p>}

                      <span>{reminder.reminderTime}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* PDFS */}

              {searchResults.pdfs?.length > 0 && (
                <div className="resultGroup">
                  <h3>📄 PDFs</h3>

                  {searchResults.pdfs.map((pdf) => (
                    <div className="searchResultItem" key={pdf._id}>
                      <strong>{pdf.fileName}</strong>

                      {pdf.summary && <p>{pdf.summary}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* EMAILS */}

              {searchResults.emails?.length > 0 && (
                <div className="resultGroup">
                  <h3>✉️ Emails</h3>

                  {searchResults.emails.map((email) => (
                    <div className="searchResultItem" key={email._id}>
                      <strong>{email.subject || email.title || "Email"}</strong>

                      {email.content && <p>{email.content}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* STUDY PLANS */}

              {searchResults.studies?.length > 0 && (
                <div className="resultGroup">
                  <h3>📚 Study Plans</h3>

                  {searchResults.studies.map((study) => (
                    <div className="searchResultItem" key={study._id}>
                      <strong>
                        {study.title || study.subject || "Study Plan"}
                      </strong>

                      {study.description && <p>{study.description}</p>}

                      {study.content && <p>{study.content}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* RESUMES */}

              {searchResults.resumes?.length > 0 && (
                <div className="resultGroup">
                  <h3>📄 Resumes</h3>

                  {searchResults.resumes.map((resume) => (
                    <div className="searchResultItem" key={resume._id}>
                      <strong>{resume.fileName || "Resume"}</strong>

                      {resume.summary && <p>{resume.summary}</p>}
                    </div>
                  ))}
                </div>
              )}

              {getResultCount() === 0 && (
                <div className="searchEmpty">
                  <div className="searchEmptyIcon">😕</div>

                  <h3>No results found</h3>

                  <p>Try searching with another keyword.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================
            AI SUMMARY
        ========================= */}

        <div className="searchaisummary">
          <div className="summaryHeader">
            <div>
              <h2>AI Summary</h2>

              <p>Coming soon</p>
            </div>

            <span>✨</span>
          </div>

          <div className="summaryContent">
            <p>
              AI-powered search summaries can be added here later. For now, Nova
              AI shows your matching data directly from your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
